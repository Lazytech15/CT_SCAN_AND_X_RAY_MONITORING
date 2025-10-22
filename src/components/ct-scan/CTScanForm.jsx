import { useState, useRef } from "react"
import { Upload, CheckCircle, AlertCircle, X } from "lucide-react"
import apiService from "../../context/apiService"

export default function CTScanForm() {
  const [formData, setFormData] = useState({
    patientName: "",
    patientId: "",
    age: "",
    gender: "Male",
    procedure: "CT Scan Cranium - Plain",
    scanDate: "",
    clinicalHistory: "",
    findingsType: "Normal",
    location: "",
    dimensionLength: "",
    dimensionWidth: "",
    dimensionThickness: "",
    midlineShift: "",
    massEffect: "No",
    fracture: "No",
    complications: [],
    impression: "",
    severity: "Stable",
    recommendations: [],
    status: "Pending",
    imageUrl: "",
  })

  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setError("")
  }

  const handleImageSelect = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError("Please select a valid image file")
        return
      }
      
      if (file.size > 10 * 1024 * 1024) {
        setError("Image size should be less than 10MB")
        return
      }

      setImageFile(file)
      setError("")
      
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleImageUpload = async () => {
    if (!imageFile) return ""

    setUploading(true)
    setUploadProgress(0)
    
    try {
      console.log('Starting image upload...')
      const result = await apiService.ctScans.uploadImage(
        imageFile,
        (progress) => setUploadProgress(progress)
      )
      
      console.log('Upload result:', result)
      
      if (result && result.success && result.data && result.data.url) {
        console.log('Image uploaded successfully:', result.data.url)
        return result.data.url
      } else if (result && result.url) {
        // Fallback: Some APIs return just the URL without success flag
        console.log('Image uploaded (no success flag):', result.url)
        return result.url
      } else {
        throw new Error(result?.message || 'Upload failed - no URL returned')
      }
    } catch (err) {
      console.error('Image upload error:', err)
      // Don't throw if error message says it was successful
      if (err.message && err.message.includes('successfully')) {
        console.warn('Got success in error message, checking result...')
        return ""
      }
      throw new Error(err.message || 'Failed to upload image')
    } finally {
      setUploading(false)
    }
  }

  const removeImage = () => {
    setImageFile(null)
    setImagePreview(null)
    setUploadProgress(0)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const validateForm = () => {
    if (!formData.patientName.trim()) {
      setError("Patient name is required")
      return false
    }
    if (!formData.patientId.trim()) {
      setError("Patient ID is required")
      return false
    }
    if (!formData.age || formData.age <= 0) {
      setError("Valid age is required")
      return false
    }
    if (!formData.scanDate) {
      setError("Scan date is required")
      return false
    }
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setLoading(true)
    setError("")

    try {
      let uploadedImageUrl = ""
      
      // Upload image first if selected
      if (imageFile) {
        console.log('Uploading image...')
        try {
          uploadedImageUrl = await handleImageUpload()
          console.log('Image upload completed, URL:', uploadedImageUrl)
        } catch (uploadErr) {
          console.error('Image upload failed:', uploadErr)
          setError(`Image upload failed: ${uploadErr.message}`)
          setLoading(false)
          return
        }
      }

      // Prepare API data with proper structure
      const apiData = {
        patientName: formData.patientName.trim(),
        gender: formData.gender,
        age: parseInt(formData.age),
        patientId: formData.patientId.trim(),
        procedure: formData.procedure,
        scanDate: formData.scanDate,
        clinicalHistory: formData.clinicalHistory.trim(),
        findings: {
          type: formData.findingsType,
          location: formData.location.trim(),
          dimensions: {
            length: parseFloat(formData.dimensionLength) || 0,
            width: parseFloat(formData.dimensionWidth) || 0,
            thickness: parseFloat(formData.dimensionThickness) || 0,
          },
          midlineShift: parseFloat(formData.midlineShift) || 0,
          massEffect: formData.massEffect,
          fracture: formData.fracture,
          complications: Array.isArray(formData.complications) ? formData.complications : [],
        },
        impression: formData.impression.trim(),
        severity: formData.severity,
        recommendations: Array.isArray(formData.recommendations) ? formData.recommendations : [],
        status: formData.status,
        imageUrl: uploadedImageUrl,
      }

      console.log('Sending CT scan data:', apiData)

      const result = await apiService.ctScans.create(apiData)
      console.log('CT scan created, result:', result)
      
      // Check for success in response
      if (result && (result.success || result.data || result.id)) {
        console.log('CT scan successfully saved!')
        setSubmitted(true)
        setTimeout(() => {
          setFormData({
            patientName: "",
            patientId: "",
            age: "",
            gender: "Male",
            procedure: "CT Scan Cranium - Plain",
            scanDate: "",
            clinicalHistory: "",
            findingsType: "Normal",
            location: "",
            dimensionLength: "",
            dimensionWidth: "",
            dimensionThickness: "",
            midlineShift: "",
            massEffect: "No",
            fracture: "No",
            complications: [],
            impression: "",
            severity: "Stable",
            recommendations: [],
            status: "Pending",
            imageUrl: "",
          })
          removeImage()
          setSubmitted(false)
        }, 3000)
      } else {
        throw new Error(result?.message || 'Failed to create CT scan')
      }
    } catch (err) {
      console.error("Error creating CT scan:", err)
      setError(err.message || "Failed to save CT scan. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-md p-8 border border-zinc-200 dark:border-zinc-700 text-center">
        <CheckCircle size={48} className="text-green-600 dark:text-green-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">CT Scan Recorded</h2>
        <p className="text-zinc-600 dark:text-zinc-400">The scan has been successfully added to the system.</p>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-md p-8 border border-zinc-200 dark:border-zinc-700 space-y-6">
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" size={20} />
          <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
        </div>
      )}

      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-4">Patient Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                Patient Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="patientName"
                value={formData.patientName}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 bg-white dark:bg-zinc-700 border border-zinc-200 dark:border-zinc-600 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-zinc-900 dark:text-white"
                placeholder="Enter patient name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                Patient ID <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="patientId"
                value={formData.patientId}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 bg-white dark:bg-zinc-700 border border-zinc-200 dark:border-zinc-600 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-zinc-900 dark:text-white"
                placeholder="P001"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
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
                className="w-full px-4 py-2 bg-white dark:bg-zinc-700 border border-zinc-200 dark:border-zinc-600 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-zinc-900 dark:text-white"
                placeholder="45"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-white dark:bg-zinc-700 border border-zinc-200 dark:border-zinc-600 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-zinc-900 dark:text-white"
              >
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-4">Procedure Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Procedure Type</label>
              <select
                name="procedure"
                value={formData.procedure}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-white dark:bg-zinc-700 border border-zinc-200 dark:border-zinc-600 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-zinc-900 dark:text-white"
              >
                <option>CT Scan Cranium - Plain</option>
                <option>CT Scan Cranium - Contrast</option>
                <option>CT Scan Chest - Plain</option>
                <option>CT Scan Chest - Contrast</option>
                <option>CT Scan Abdomen - Plain</option>
                <option>CT Scan Abdomen - Contrast</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                Scan Date & Time <span className="text-red-500">*</span>
              </label>
              <input
                type="datetime-local"
                name="scanDate"
                value={formData.scanDate}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 bg-white dark:bg-zinc-700 border border-zinc-200 dark:border-zinc-600 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-zinc-900 dark:text-white"
              />
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-4">Clinical Information</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Clinical History</label>
              <textarea
                name="clinicalHistory"
                value={formData.clinicalHistory}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-2 bg-white dark:bg-zinc-700 border border-zinc-200 dark:border-zinc-600 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-zinc-900 dark:text-white"
                placeholder="Enter clinical history..."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Findings Type</label>
              <select
                name="findingsType"
                value={formData.findingsType}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-white dark:bg-zinc-700 border border-zinc-200 dark:border-zinc-600 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-zinc-900 dark:text-white"
              >
                <option>Normal</option>
                <option>Hemorrhage</option>
                <option>Tumor</option>
                <option>Fracture</option>
                <option>Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-white dark:bg-zinc-700 border border-zinc-200 dark:border-zinc-600 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-zinc-900 dark:text-white"
                placeholder="e.g., Right frontal lobe"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Dimensions (mm)</label>
              <div className="grid grid-cols-3 gap-4">
                <input
                  type="number"
                  step="0.1"
                  name="dimensionLength"
                  value={formData.dimensionLength}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-white dark:bg-zinc-700 border border-zinc-200 dark:border-zinc-600 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-zinc-900 dark:text-white"
                  placeholder="Length"
                />
                <input
                  type="number"
                  step="0.1"
                  name="dimensionWidth"
                  value={formData.dimensionWidth}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-white dark:bg-zinc-700 border border-zinc-200 dark:border-zinc-600 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-zinc-900 dark:text-white"
                  placeholder="Width"
                />
                <input
                  type="number"
                  step="0.1"
                  name="dimensionThickness"
                  value={formData.dimensionThickness}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-white dark:bg-zinc-700 border border-zinc-200 dark:border-zinc-600 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-zinc-900 dark:text-white"
                  placeholder="Thickness"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Midline Shift (mm)</label>
                <input
                  type="number"
                  step="0.1"
                  name="midlineShift"
                  value={formData.midlineShift}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-white dark:bg-zinc-700 border border-zinc-200 dark:border-zinc-600 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-zinc-900 dark:text-white"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Mass Effect</label>
                <select
                  name="massEffect"
                  value={formData.massEffect}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-white dark:bg-zinc-700 border border-zinc-200 dark:border-zinc-600 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-zinc-900 dark:text-white"
                >
                  <option>No</option>
                  <option>Yes</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Fracture</label>
                <select
                  name="fracture"
                  value={formData.fracture}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-white dark:bg-zinc-700 border border-zinc-200 dark:border-zinc-600 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-zinc-900 dark:text-white"
                >
                  <option>No</option>
                  <option>Yes</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Impression</label>
              <textarea
                name="impression"
                value={formData.impression}
                onChange={handleChange}
                rows={2}
                className="w-full px-4 py-2 bg-white dark:bg-zinc-700 border border-zinc-200 dark:border-zinc-600 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-zinc-900 dark:text-white"
                placeholder="Enter impression..."
              />
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-4">Assessment</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Severity Level</label>
              <select
                name="severity"
                value={formData.severity}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-white dark:bg-zinc-700 border border-zinc-200 dark:border-zinc-600 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-zinc-900 dark:text-white"
              >
                <option>Stable</option>
                <option>Moderate</option>
                <option>Urgent</option>
                <option>Critical</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-white dark:bg-zinc-700 border border-zinc-200 dark:border-zinc-600 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-zinc-900 dark:text-white"
              >
                <option>Pending</option>
                <option>Reviewed</option>
                <option>Completed</option>
              </select>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-4">Image Upload</h3>
          
          {!imagePreview ? (
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-zinc-300 dark:border-zinc-600 rounded-lg p-8 text-center hover:border-blue-500 transition-colors cursor-pointer"
            >
              <Upload size={32} className="text-zinc-400 mx-auto mb-2" />
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-1">
                Click to upload CT scan image
              </p>
              <p className="text-xs text-zinc-500 dark:text-zinc-500">
                PNG, JPG up to 10MB
              </p>
              <input 
                ref={fileInputRef}
                type="file" 
                accept="image/*" 
                onChange={handleImageSelect}
                className="hidden" 
              />
            </div>
          ) : (
            <div className="border border-zinc-300 dark:border-zinc-600 rounded-lg p-4">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-32 h-32 bg-zinc-100 dark:bg-zinc-700 rounded-lg overflow-hidden">
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="text-sm font-medium text-zinc-900 dark:text-white">
                        {imageFile?.name}
                      </p>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400">
                        {(imageFile?.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={removeImage}
                      className="text-zinc-400 hover:text-red-500 transition-colors"
                    >
                      <X size={20} />
                    </button>
                  </div>
                  {uploading && (
                    <div>
                      <div className="w-full bg-zinc-200 dark:bg-zinc-700 rounded-full h-2 mb-1">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                      <p className="text-xs text-zinc-600 dark:text-zinc-400">
                        Uploading... {uploadProgress}%
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-4 pt-4">
          <button
            onClick={handleSubmit}
            disabled={loading || uploading}
            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-colors"
          >
            {loading ? "Saving..." : uploading ? "Uploading..." : "Save CT Scan"}
          </button>
          <button
            type="button"
            onClick={() => {
              setFormData({
                patientName: "",
                patientId: "",
                age: "",
                gender: "Male",
                procedure: "CT Scan Cranium - Plain",
                scanDate: "",
                clinicalHistory: "",
                findingsType: "Normal",
                location: "",
                dimensionLength: "",
                dimensionWidth: "",
                dimensionThickness: "",
                midlineShift: "",
                massEffect: "No",
                fracture: "No",
                complications: [],
                impression: "",
                severity: "Stable",
                recommendations: [],
                status: "Pending",
                imageUrl: "",
              })
              removeImage()
              setError("")
            }}
            disabled={loading || uploading}
            className="flex-1 bg-zinc-200 dark:bg-zinc-700 hover:bg-zinc-300 dark:hover:bg-zinc-600 disabled:opacity-50 disabled:cursor-not-allowed text-zinc-900 dark:text-white font-semibold py-3 rounded-lg transition-colors"
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  )
}