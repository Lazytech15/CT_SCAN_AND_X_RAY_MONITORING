import { useState, useEffect } from "react"
import { Moon, Sun, LogOut, User, Mail, Phone, Camera, Edit2, Save, X, Lock } from "lucide-react"
import apiService from "../context/apiService"

export default function Profile({ onLogout, darkMode, setDarkMode }) {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)

  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    phone: ""
  })

  const [passwordForm, setPasswordForm] = useState({
    current_password: "",
    new_password: "",
    confirm_password: ""
  })

  const [successMessage, setSuccessMessage] = useState("")
  const [errorMessage, setErrorMessage] = useState("")

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    try {
      setLoading(true)
      const response = await apiService.users.getProfile()
      if (response.success) {
        setProfile(response.data)
        setEditForm({
          name: response.data.name || "",
          email: response.data.email || "",
          phone: response.data.phone || ""
        })
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDarkModeToggle = () => {
    setDarkMode(!darkMode)
  }

  const handleEditToggle = () => {
    if (isEditing) {
      setEditForm({
        name: profile.name || "",
        email: profile.email || "",
        phone: profile.phone || ""
      })
    }
    setIsEditing(!isEditing)
    setErrorMessage("")
    setSuccessMessage("")
  }

  const handleEditChange = (e) => {
    setEditForm({
      ...editForm,
      [e.target.name]: e.target.value
    })
  }

  const handleUpdateProfile = async () => {
    try {
      setErrorMessage("")
      setSuccessMessage("")
      const response = await apiService.users.update(editForm)
      if (response.success) {
        setProfile(response.data)
        setIsEditing(false)
        setSuccessMessage("Profile updated successfully!")
        setTimeout(() => setSuccessMessage(""), 3000)
      }
    } catch (err) {
      setErrorMessage(err.message)
    }
  }

  const handlePasswordChange = (e) => {
    setPasswordForm({
      ...passwordForm,
      [e.target.name]: e.target.value
    })
  }

  const handleChangePassword = async () => {
    if (passwordForm.new_password !== passwordForm.confirm_password) {
      setErrorMessage("New passwords do not match")
      return
    }

    try {
      setErrorMessage("")
      setSuccessMessage("")
      const response = await apiService.users.changePassword(passwordForm)
      if (response.success) {
        setPasswordForm({
          current_password: "",
          new_password: "",
          confirm_password: ""
        })
        setIsChangingPassword(false)
        setSuccessMessage("Password changed successfully!")
        setTimeout(() => setSuccessMessage(""), 3000)
      }
    } catch (err) {
      setErrorMessage(err.message)
    }
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setErrorMessage("Please select an image file")
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage("Image size must be less than 5MB")
      return
    }

    try {
      setUploadingImage(true)
      setErrorMessage("")
      const response = await apiService.users.uploadProfileImage(file)
      if (response.success) {
        setProfile({
          ...profile,
          profile_image: response.data.profile_image
        })
        setSuccessMessage("Profile image updated successfully!")
        setTimeout(() => setSuccessMessage(""), 3000)
      }
    } catch (err) {
      setErrorMessage(err.message)
    } finally {
      setUploadingImage(false)
    }
  }

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-zinc-600 dark:text-zinc-400">Loading profile...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-red-800 dark:text-red-200">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold mb-2">Profile</h1>
        <p className="text-zinc-600 dark:text-zinc-400">Manage your account settings</p>
      </div>

      {successMessage && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
          <p className="text-green-800 dark:text-green-200">{successMessage}</p>
        </div>
      )}

      {errorMessage && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-red-800 dark:text-red-200">{errorMessage}</p>
        </div>
      )}

      <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-md p-6 border border-zinc-200 dark:border-zinc-700">
        <h2 className="text-lg font-bold text-zinc-900 dark:text-white mb-4">Profile Picture</h2>
        <div className="flex items-center gap-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center overflow-hidden">
              {profile?.profile_image ? (
                <img
                  src={`http://qxw.2ee.mytemp.website/projectipt2/api/${profile.profile_image}`}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <User size={48} className="text-zinc-400" />
              )}
            </div>
            <label
              htmlFor="profile-upload"
              className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-2 cursor-pointer transition-colors"
            >
              <Camera size={16} />
            </label>
            <input
              id="profile-upload"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              disabled={uploadingImage}
            />
          </div>
          <div>
            <p className="font-semibold text-zinc-900 dark:text-white">{profile?.name}</p>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">Click the camera icon to upload a new photo</p>
            {uploadingImage && (
              <p className="text-sm text-blue-600 dark:text-blue-400 mt-2">Uploading...</p>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-md p-6 border border-zinc-200 dark:border-zinc-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-zinc-900 dark:text-white">Account Information</h2>
          <button
            onClick={handleEditToggle}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            {isEditing ? (
              <>
                <X size={16} />
                Cancel
              </>
            ) : (
              <>
                <Edit2 size={16} />
                Edit
              </>
            )}
          </button>
        </div>

        {isEditing ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={editForm.name}
                onChange={handleEditChange}
                className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={editForm.email}
                onChange={handleEditChange}
                className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                Phone
              </label>
              <input
                type="tel"
                name="phone"
                value={editForm.phone}
                onChange={handleEditChange}
                className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={handleUpdateProfile}
              className="flex items-center gap-2 px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
            >
              <Save size={16} />
              Save Changes
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-zinc-50 dark:bg-zinc-700/50 rounded-lg">
              <User size={24} className="text-blue-600 dark:text-blue-400" />
              <div>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">Name</p>
                <p className="font-semibold text-zinc-900 dark:text-white">{profile?.name || 'Not set'}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-zinc-50 dark:bg-zinc-700/50 rounded-lg">
              <Mail size={24} className="text-blue-600 dark:text-blue-400" />
              <div>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">Email</p>
                <p className="font-semibold text-zinc-900 dark:text-white">{profile?.email || 'Not set'}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-zinc-50 dark:bg-zinc-700/50 rounded-lg">
              <Phone size={24} className="text-blue-600 dark:text-blue-400" />
              <div>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">Phone</p>
                <p className="font-semibold text-zinc-900 dark:text-white">{profile?.phone || 'Not set'}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-md p-6 border border-zinc-200 dark:border-zinc-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-zinc-900 dark:text-white">Security</h2>
          <button
            onClick={() => {
              setIsChangingPassword(!isChangingPassword)
              setErrorMessage("")
              setPasswordForm({ current_password: "", new_password: "", confirm_password: "" })
            }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            {isChangingPassword ? (
              <>
                <X size={16} />
                Cancel
              </>
            ) : (
              <>
                <Lock size={16} />
                Change Password
              </>
            )}
          </button>
        </div>

        {isChangingPassword ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                Current Password
              </label>
              <input
                type="password"
                name="current_password"
                value={passwordForm.current_password}
                onChange={handlePasswordChange}
                className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                New Password
              </label>
              <input
                type="password"
                name="new_password"
                value={passwordForm.new_password}
                onChange={handlePasswordChange}
                minLength={8}
                className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">Minimum 8 characters</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                Confirm New Password
              </label>
              <input
                type="password"
                name="confirm_password"
                value={passwordForm.confirm_password}
                onChange={handlePasswordChange}
                className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={handleChangePassword}
              className="flex items-center gap-2 px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
            >
              <Save size={16} />
              Update Password
            </button>
          </div>
        ) : (
          <p className="text-zinc-600 dark:text-zinc-400">Click the button above to change your password</p>
        )}
      </div>

      {/* <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-md p-6 border border-zinc-200 dark:border-zinc-700">
        <h2 className="text-lg font-bold text-zinc-900 dark:text-white mb-4">Settings</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-700/50 rounded-lg">
            <div className="flex items-center gap-3">
              {darkMode ? <Moon size={24} className="text-amber-500" /> : <Sun size={24} className="text-amber-500" />}
              <div>
                <p className="font-semibold text-zinc-900 dark:text-white">Dark Mode</p>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">Toggle dark mode theme</p>
              </div>
            </div>
            <button
              onClick={handleDarkModeToggle}
              className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${darkMode ? "bg-blue-600" : "bg-zinc-300"
                }`}
            >
              <span
                className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${darkMode ? "translate-x-7" : "translate-x-1"
                  }`}
              />
            </button>
          </div>
        </div>
      </div> */}

      <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-md p-6 border border-zinc-200 dark:border-zinc-700">
        <h2 className="text-lg font-bold text-zinc-900 dark:text-white mb-4">Session</h2>
        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-lg transition-colors"
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </div>
  )
}