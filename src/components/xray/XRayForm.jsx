import { useState, useRef } from "react"
import { Upload, CheckCircle, AlertCircle, X } from "lucide-react"
import apiService from "../../context/apiService"

export default function XRayForm() {
  const [formData, setFormData] = useState({
    patientName: "",
    patientId: "",
    age: "",
    gender: "Male",
    procedure: "Chest X-Ray",
    scanDate: "",
    clinicalHistory: "",
    findingsType: "Normal",
    affectedAreas: [],
    opacity: "Clear",
    complications: [],
    additionalFindings: "",
    impression: "",
    severity: "Stable",
    recommendations: [],
    status: "Pending",
    temperature: "",
    o2Saturation: "",
    respiratoryRate: "",
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

  const handleCheckboxChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter((item) => item !== value)
        : [...prev[field], value],
    }))
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
      console.log('Starting X-ray image upload...')
      const result = await apiService.xrays.uploadImage(
        imageFile,
        (progress) => setUploadProgress(progress)
      )
      
      console.log('Upload result:', result)
      
      // Check if upload was successful and has URL
      // The API returns: { success: true, data: { url: "..." } }
      if (result && result.success && result.data && result.data.url) {
        console.log('Image uploaded successfully:', result.data.url)
        return result.data.url
      } else if (result && result.url) {
        console.log('Image uploaded (direct URL):', result.url)
        return result.url
      } else if (result && result.data && result.data.url) {
        console.log('Image uploaded (data.url):', result.data.url)
        return result.data.url
      } else {
        console.error('Upload result missing URL:', result)
        throw new Error('Upload succeeded but no URL returned')
      }
    } catch (err) {
      console.error('Image upload error:', err)
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
        console.log('Uploading X-ray image...')
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
          affectedAreas: Array.isArray(formData.affectedAreas) ? formData.affectedAreas : [],
          opacity: formData.opacity,
          complications: Array.isArray(formData.complications) ? formData.complications : [],
          additionalFindings: formData.additionalFindings.trim(),
        },
        impression: formData.impression.trim(),
        severity: formData.severity,
        recommendations: Array.isArray(formData.recommendations) ? formData.recommendations : [],
        status: formData.status,
        vitalSigns: {
          temperature: parseFloat(formData.temperature) || 0,
          o2Saturation: parseInt(formData.o2Saturation) || 0,
          respiratoryRate: parseInt(formData.respiratoryRate) || 0,
        },
        imageUrl: uploadedImageUrl,
      }

      console.log('Sending X-ray data:', apiData)

      const result = await apiService.xrays.create(apiData)
      console.log('X-ray created, result:', result)
      
      // Check for success in response
      if (result && (result.success || result.data || result.id)) {
        console.log('X-ray successfully saved!')
        setSubmitted(true)
        setTimeout(() => {
          setFormData({
            patientName: "",
            patientId: "",
            age: "",
            gender: "Male",
            procedure: "Chest X-Ray",
            scanDate: "",
            clinicalHistory: "",
            findingsType: "Normal",
            affectedAreas: [],
            opacity: "Clear",
            complications: [],
            additionalFindings: "",
            impression: "",
            severity: "Stable",
            recommendations: [],
            status: "Pending",
            temperature: "",
            o2Saturation: "",
            respiratoryRate: "",
            imageUrl: "",
          })
          removeImage()
          setSubmitted(false)
        }, 3000)
      } else {
        throw new Error(result?.message || 'Failed to create X-ray')
      }
    } catch (err) {
      console.error("Error creating X-ray:", err)
      setError(err.message || "Failed to save X-ray. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-md p-8 border border-zinc-200 dark:border-zinc-700 text-center">
        <CheckCircle size={48} className="text-green-600 dark:text-green-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">X-Ray Recorded</h2>
        <p className="text-zinc-600 dark:text-zinc-400">The X-ray has been successfully added to the system.</p>
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
                placeholder="52"
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
                <option>Chest X-Ray</option>
                <option>Abdominal X-Ray</option>
                <option>Extremity X-Ray</option>
                <option>Spine X-Ray</option>
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
                <option>Pneumonia</option>
                <option>Fracture</option>
                <option>Mass</option>
                <option>Other</option>
              </select>
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

            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Additional Findings</label>
              <textarea
                name="additionalFindings"
                value={formData.additionalFindings}
                onChange={handleChange}
                rows={2}
                className="w-full px-4 py-2 bg-white dark:bg-zinc-700 border border-zinc-200 dark:border-zinc-600 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-zinc-900 dark:text-white"
                placeholder="Enter additional findings..."
              />
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-4">Vital Signs</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Temperature (°C)</label>
              <input
                type="number"
                step="0.1"
                name="temperature"
                value={formData.temperature}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-white dark:bg-zinc-700 border border-zinc-200 dark:border-zinc-600 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-zinc-900 dark:text-white"
                placeholder="37.0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">O2 Saturation (%)</label>
              <input
                type="number"
                name="o2Saturation"
                value={formData.o2Saturation}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-white dark:bg-zinc-700 border border-zinc-200 dark:border-zinc-600 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-zinc-900 dark:text-white"
                placeholder="98"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Respiratory Rate</label>
              <input
                type="number"
                name="respiratoryRate"
                value={formData.respiratoryRate}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-white dark:bg-zinc-700 border border-zinc-200 dark:border-zinc-600 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-zinc-900 dark:text-white"
                placeholder="16"
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
                Click to upload X-ray image
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
            {loading ? "Saving..." : uploading ? "Uploading..." : "Save X-Ray"}
          </button>
          <button
            type="button"
            onClick={() => {
              setFormData({
                patientName: "",
                patientId: "",
                age: "",
                gender: "Male",
                procedure: "Chest X-Ray",
                scanDate: "",
                clinicalHistory: "",
                findingsType: "Normal",
                affectedAreas: [],
                opacity: "Clear",
                complications: [],
                additionalFindings: "",
                impression: "",
                severity: "Stable",
                recommendations: [],
                status: "Pending",
                temperature: "",
                o2Saturation: "",
                respiratoryRate: "",
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