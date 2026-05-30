import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { generateAvatar } from "../../utils/GenerateAvatar";

export default function Profile() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [avatars, setAvatars] = useState([]);
  const [selectedAvatar, setSelectedAvatar] = useState();
  const [loading, setLoading] = useState(false);
  const { currentUser, updateUserProfile, setError } = useAuth();

  useEffect(() => {
    setAvatars(generateAvatar());
  }, []);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (selectedAvatar === undefined) return setError("Please select an avatar");
    try {
      setError("");
      setLoading(true);
      await updateUserProfile(currentUser, {
        displayName: username,
        photoURL: avatars[selectedAvatar],
      });
      navigate("/");
    } catch (e) {
      setError("Failed to update profile");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">Pick your avatar</h1>
          <p className="text-gray-500 dark:text-slate-400">Choose an avatar and set your display name</p>
        </div>

        <div className="bg-white border border-gray-200 dark:bg-slate-800/50 dark:border-slate-700/50 rounded-2xl p-8 shadow-xl">
          <form onSubmit={handleFormSubmit} className="space-y-6">
            <div className="grid grid-cols-3 gap-3">
              {avatars.map((avatar, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setSelectedAvatar(index)}
                  className={`relative aspect-square rounded-2xl overflow-hidden transition-all duration-200 ${
                    index === selectedAvatar
                      ? "ring-2 ring-indigo-500 ring-offset-2 ring-offset-white dark:ring-offset-slate-800 scale-105"
                      : "ring-1 ring-gray-200 dark:ring-slate-600/50 hover:ring-indigo-400 dark:hover:ring-indigo-500/50"
                  }`}
                >
                  <img src={avatar} alt={`avatar ${index + 1}`} className="w-full h-full object-cover bg-gray-100 dark:bg-slate-700" />
                  {index === selectedAvatar && (
                    <div className="absolute inset-0 bg-indigo-500/10 flex items-center justify-center">
                      <div className="w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center shadow-lg">
                        <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    </div>
                  )}
                </button>
              ))}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">Display Name</label>
              <input
                type="text"
                required
                placeholder="Enter your name"
                defaultValue={currentUser.displayName || ""}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-slate-700/50 dark:border-slate-600/50 dark:text-white dark:placeholder-slate-500 transition-all duration-200"
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white font-semibold rounded-xl shadow-lg shadow-indigo-500/25 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Saving..." : "Save & Continue"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}