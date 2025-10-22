import { useState } from "react"
import { Save, X, AlertCircle, Upload, Image as ImageIcon } from "lucide-react"
import apiService from "../../context/apiService"

export default function XRayEdit({ xray, onCancel, onSave }) {
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(xray.imageUrl || xray.image_url || null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  
  const [formData, setFormData] = useState({
    patientName: xray.patientName || xray.patient_name || '',
    patientId: xray.patientId || xray.patient_id || '',
    age: xray.age || '',
    gender: xray.gender || '',
    procedure: xray.procedure || '',
    status: xray.status || '',
    severity: xray.severity || 'Stable',
    temperature: xray.vitalSigns?.temperature || xray.temperature || '',
    o2Saturation: xray.vitalSigns?.o2Saturation || xray.o2_saturation || '',
    respiratoryRate: xray.vitalSigns?.respiratoryRate || xray.respiratory_rate || '',
    clinicalHistory: xray.clinicalHistory || xray.clinical_history || '',
    findingsType: xray.findings?.type || xray.findings_type || '',
    affectedAreas: (xray.findings?.affectedAreas || xray.affected_areas || []).join(', '),
    opacity: xray.findings?.opacity || xray.opacity || '',
    additionalFindings: xray.findings?.additionalFindings || xray.additional_findings || '',
    impression: xray.impression || '',
    recommendations: xray.recommendations?.join('\n') || '',
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleImageSelect = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file')
        return
      }
      
      // Validate file size (e.g., max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size should be less than 5MB')
        return
      }

      setImageFile(file)
      setError(null)
      
      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveImage = () => {
    setImageFile(null)
    setImagePreview(xray.imageUrl || xray.image_url || null)
    // Reset file input
    const fileInput = document.getElementById('image-upload')
    if (fileInput) fileInput.value = ''
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError(null)

    try {
      let uploadedImageUrl = imagePreview

      // Upload image if a new one was selected
      if (imageFile) {
        setIsUploading(true)
        try {
          const uploadResult = await apiService.xrays.uploadImage(
            imageFile,
            (progress) => setUploadProgress(progress)
          )
          
          if (uploadResult.success && uploadResult.url) {
            uploadedImageUrl = uploadResult.url
          } else {
            throw new Error('Image upload failed')
          }
        } catch (uploadError) {
          throw new Error(`Failed to upload image: ${uploadError.message}`)
        } finally {
          setIsUploading(false)
          setUploadProgress(0)
        }
      }

      // Ensure we always have the image URL set, even if no new image was uploaded
      const finalImageUrl = uploadedImageUrl || xray.imageUrl || xray.image_url

      const affectedAreasArray = formData.affectedAreas
        .split(',')
        .map(area => area.trim())
        .filter(area => area)

      const updatedXRay = {
        patientName: formData.patientName,
        patientId: formData.patientId,
        age: parseInt(formData.age),
        gender: formData.gender,
        procedure: formData.procedure,
        scanDate: xray.scanDate || xray.scan_date,
        status: formData.status,
        severity: formData.severity,
        imageUrl: finalImageUrl,
        vitalSigns: {
          temperature: parseFloat(formData.temperature),
          o2Saturation: parseFloat(formData.o2Saturation),
          respiratoryRate: parseInt(formData.respiratoryRate),
        },
        clinicalHistory: formData.clinicalHistory,
        findings: {
          type: formData.findingsType,
          affectedAreas: affectedAreasArray,
          opacity: formData.opacity,
          additionalFindings: formData.additionalFindings,
          complications: xray.findings?.complications || xray.complications || []
        },
        impression: formData.impression,
        recommendations: formData.recommendations.split('\n').filter(r => r.trim()),
      }
      
      // Call the API to update the database
      await apiService.xrays.update(xray.id, updatedXRay)
      
      // Prepare the response with both formats for UI compatibility
      const responseData = {
        ...xray,
        ...updatedXRay,
        patient_name: updatedXRay.patientName,
        patient_id: updatedXRay.patientId,
        image_url: finalImageUrl,
        temperature: updatedXRay.vitalSigns.temperature,
        o2_saturation: updatedXRay.vitalSigns.o2Saturation,
        respiratory_rate: updatedXRay.vitalSigns.respiratoryRate,
        clinical_history: updatedXRay.clinicalHistory,
        findings_type: updatedXRay.findings.type,
        affected_areas: updatedXRay.findings.affectedAreas,
        opacity: updatedXRay.findings.opacity,
        additional_findings: updatedXRay.findings.additionalFindings,
        complications: updatedXRay.findings.complications
      }
      
      await onSave(responseData)
    } catch (err) {
      setError(err.message || 'Failed to save changes')
      setSaving(false)
    }
  }

  const getSeverityColor = (severity) => {
    switch (severity) {
      case "Urgent":
        return "bg-orange-100 dark:bg-orange-900/20 text-orange-800 dark:text-orange-200 border-orange-200 dark:border-orange-800"
      case "Moderate":
        return "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200 border-yellow-200 dark:border-yellow-800"
      case "Stable":
        return "bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200 border-green-200 dark:border-green-800"
      default:
        return "bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border-zinc-200 dark:border-zinc-700"
    }
  }

  return (
    <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-md border border-zinc-200 dark:border-zinc-700">
      {/* Header */}
      <div className="p-6 border-b border-zinc-200 dark:border-zinc-700">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold mb-1 text-zinc-900 dark:text-white">Edit X-Ray</h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">Update X-ray information</p>
          </div>
          <button
            onClick={onCancel}
            disabled={saving}
            className="p-2 text-white hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded-lg transition-colors disabled:opacity-50"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mx-6 mt-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-center gap-3">
          <AlertCircle className="text-red-600 dark:text-red-400" size={20} />
          <p className="text-red-800 dark:text-red-200 text-sm">{error}</p>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
        {/* Image Upload Section */}
        <div className="space-y-4">
          <h3 className="font-semibold text-white text-lg">X-Ray Image</h3>
          
          {imagePreview ? (
            <div className="relative">
              <img
                src={imagePreview}
                alt="X-Ray Preview"
                className="w-full h-64 object-cover rounded-lg bg-zinc-100 dark:bg-zinc-700"
              />
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <X size={20} />
              </button>
              {imageFile && (
                <div className="absolute text-white bottom-2 left-2 bg-blue-600 text-white px-3 py-1 rounded text-sm">
                  New image selected
                </div>
              )}
            </div>
          ) : (
            <div className="w-full h-64 rounded-lg bg-zinc-100 dark:bg-zinc-700 flex items-center justify-center">
              <div className="text-center">
                <ImageIcon className="mx-auto mb-2 text-zinc-400" size={48} />
                <p className="text-zinc-500 text-white dark:text-zinc-400">No image available</p>
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <label className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer">
              <Upload size={20} />
              {imageFile ? 'Change Image' : 'Upload New Image'}
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
                disabled={saving || isUploading}
              />
            </label>
            {imageFile && (
              <button
                type="button"
                onClick={handleRemoveImage}
                className="px-4 py-2 bg-zinc-200 dark:bg-zinc-700 text-zinc-800 dark:text-zinc-200 rounded-lg hover:bg-zinc-300 dark:hover:bg-zinc-600 transition-colors"
              >
                Cancel
              </button>
            )}
          </div>

          {isUploading && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-zinc-600 text-white dark:text-zinc-400">Uploading...</span>
                <span className="text-zinc-600 dark:text-zinc-400">{uploadProgress}%</span>
              </div>
              <div className="w-full bg-zinc-200 dark:bg-zinc-700 rounded-full h-2">
                <div
                  className="bg-blue-600 text-white h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Patient Information */}
        <div className="space-y-4">
          <h3 className="font-semibold text-white text-lg">Patient Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Patient Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="patientName"
                value={formData.patientName}
                onChange={handleChange}
                required
                className="w-full text-white px-4 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Patient ID <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="patientId"
                value={formData.patientId}
                onChange={handleChange}
                required
                className="w-full text-white px-4 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Age <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                required
                min="0"
                max="150"
                className="w-full text-white px-4 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Gender <span className="text-red-500">*</span>
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                required
                className="w-full text-white px-4 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
        </div>

        {/* Scan Details */}
        <div className="space-y-4">
          <h3 className="font-semibold text-white text-lg">Scan Details</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Procedure <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="procedure"
                value={formData.procedure}
                onChange={handleChange}
                required
                className="w-full text-white px-4 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Status <span className="text-red-500">*</span>
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
                className="w-full text-white px-4 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              >
                <option value="">Select Status</option>
                <option value="Pending">Pending</option>
                <option value="Completed">Completed</option>
                <option value="In Progress">In Progress</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-white text-sm font-medium mb-2">
                Severity <span className="text-red-500">*</span>
              </label>
              <select
                name="severity"
                value={formData.severity}
                onChange={handleChange}
                required
                className={`w-full text-white px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 ${getSeverityColor(formData.severity)}`}
              >
                <option value="Stable">Stable</option>
                <option value="Moderate">Moderate</option>
                <option value="Urgent">Urgent</option>
              </select>
            </div>
          </div>
        </div>

        {/* Vital Signs */}
        <div className="space-y-4">
          <h3 className="font-semibold text-white text-lg">Vital Signs</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Temperature (°C) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="temperature"
                value={formData.temperature}
                onChange={handleChange}
                required
                step="0.1"
                min="35"
                max="45"
                className="w-full text-white px-4 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-white text-sm font-medium mb-2">
                O2 Saturation (%) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="o2Saturation"
                value={formData.o2Saturation}
                onChange={handleChange}
                required
                min="0"
                max="100"
                className="w-full text-white px-4 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Respiratory Rate <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="respiratoryRate"
                value={formData.respiratoryRate}
                onChange={handleChange}
                required
                min="0"
                max="100"
                className="w-full text-white px-4 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Clinical Information */}
        <div className="space-y-4">
          <h3 className="font-semibold text-white text-lg">Clinical Information</h3>
          
          <div>
            <label className="block text-sm font-medium mb-2">
              Clinical History <span className="text-red-500">*</span>
            </label>
            <textarea
              name="clinicalHistory"
              value={formData.clinicalHistory}
              onChange={handleChange}
              required
              rows={3}
              className="w-full text-white px-4 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              placeholder="Enter clinical history..."
            />
          </div>
        </div>

        {/* Findings */}
        <div className="space-y-4">
          <h3 className="font-semibold text-white text-lg">Findings</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Findings Type <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="findingsType"
                value={formData.findingsType}
                onChange={handleChange}
                required
                placeholder="e.g., Pneumonia"
                className="w-full text-white px-4 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Opacity
              </label>
              <input
                type="text"
                name="opacity"
                value={formData.opacity}
                onChange={handleChange}
                placeholder="e.g., Ground-glass"
                className="w-full text-white px-4 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-white text-sm font-medium mb-2">
              Affected Areas (comma-separated)
            </label>
            <input
              type="text"
              name="affectedAreas"
              value={formData.affectedAreas}
              onChange={handleChange}
              placeholder="e.g., Right upper lobe, Left lower lobe"
              className="w-full text-white px-4 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-white text-sm font-medium mb-2">
              Additional Findings
            </label>
            <textarea
              name="additionalFindings"
              value={formData.additionalFindings}
              onChange={handleChange}
              rows={2}
              className="w-full text-white px-4 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              placeholder="Enter additional findings..."
            />
          </div>
        </div>

        {/* Impression */}
        <div className="space-y-4">
          <h3 className="font-semibold text-white text-lg">Impression</h3>
          
          <div>
            <label className="block text-white text-sm font-medium mb-2">
              Impression <span className="text-red-500">*</span>
            </label>
            <textarea
              name="impression"
              value={formData.impression}
              onChange={handleChange}
              required
              rows={3}
              className="w-full text-white px-4 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              placeholder="Enter clinical impression..."
            />
          </div>
        </div>

        {/* Recommendations */}
        <div className="space-y-4">
          <h3 className="font-semibold text-white text-lg">Recommendations</h3>
          
          <div>
            <label className="block text-white text-sm font-medium mb-2">
              Recommendations (one per line)
            </label>
            <textarea
              name="recommendations"
              value={formData.recommendations}
              onChange={handleChange}
              rows={4}
              className="w-full text-white px-4 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              placeholder="Enter recommendations, one per line..."
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex  gap-3 pt-4 border-t border-zinc-200 dark:border-zinc-700 sticky bottom-0 bg-white dark:bg-zinc-800">
          <button
            type="submit"
            disabled={saving || isUploading}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save size={20} />
            {isUploading ? 'Uploading...' : saving ? 'Saving...' : 'Save Changes'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            disabled={saving || isUploading}
            className="px-6 py-3 bg-zinc-200 dark:bg-zinc-700 text-zinc-800 dark:text-zinc-200 rounded-lg hover:bg-zinc-300 dark:hover:bg-zinc-600 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}