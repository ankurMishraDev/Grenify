import { useState } from "react";
import useAuthUser from "../hooks/useAuthUser";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { completeOnboarding } from "../lib/api";
import { toast } from "react-hot-toast";
import { CameraIcon, MapPinIcon } from "lucide-react";
import { LANGUAGES } from "../constants";
const OnboardingPage = () => {
  const { authUser } = useAuthUser();
  const queryClient = useQueryClient();
  const [formState, setFormState] = useState({
    fullName: authUser?.fullName || "",
    bio: authUser?.bio || "",
    nativeLanguage: authUser?.nativeLanguage || "",
    learningLanguage: authUser?.learningLanguage || "",
    location: authUser?.location || "",
    profilePic: authUser?.profilePic || "",
  });

  const { mutate, isPending } = useMutation({
    mutationFn: completeOnboarding,
    onSuccess: () => {
      toast.success("Onboarding completed successfully");
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
    onError: (error) => {
      console.error("Error completing onboarding:", error);
      toast.error(error.response.data.message);
    },
  });
  const handleAvatarChange = () => {
    const idx = Math.floor(Math.random() * 100) + 1;
    const newAvatarPic = `https://avatar.iran.liara.run/public/${idx}.png`;
    setFormState({ ...formState, profilePic: newAvatarPic });
    toast.success("Avatar picture updated successfully");
    
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    mutate(formState);
  };
  return (
    <div className="min-h-screen bg-base-100 flex items-center justify-center p-2">
      <div className="card bg-base-200 w-full max-w-4xl shadow-xl max-h-[80vh]">
        <div className="card-body p-6 sm:p-8 overflow-y-auto">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column - Heading and Profile */}
            <div className="flex flex-col items-center justify-start space-y-6">
              <h1 className="text-2xl sm:text-3xl font-bold text-center mb-4">
                Complete Your Profile
              </h1>
              
              {/* Profile pic */}
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="size-40 rounded-full bg-base-300 overflow-hidden">
                  {formState.profilePic ? (
                    <img
                      src={formState.profilePic}
                      alt="Profile image preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <CameraIcon className="size-16 text-base-content opacity-50" />
                    </div>
                  )}
                </div>
                
                <button
                  className="btn btn-accent"
                  onClick={handleAvatarChange}
                  type="button"
                >
                  Change Avatar
                </button>
              </div>
            </div>

            {/* Right Column - Form Fields */}
            <div className="space-y-4">
              {/* Form fields */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Full Name</span>
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formState.fullName}
                  onChange={(e) => setFormState({ ...formState, fullName: e.target.value })}
                  className="input input-bordered w-full"
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Bio</span>
                </label>
                <input
                  type="text"
                  name="bio"
                  value={formState.bio}
                  onChange={(e) => setFormState({ ...formState, bio: e.target.value })}
                  className="input input-bordered w-full"
                  placeholder="Enter your Bio details here"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {/* Language fields */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Native Language</span>
                  </label>
                  <select
                    name="nativeLanguage"
                    value={formState.nativeLanguage}
                    onChange={(e) => setFormState({ ...formState, nativeLanguage: e.target.value })}
                    className="select select-bordered w-full"
                    required
                  >
                    <option value="">Select</option>
                    {LANGUAGES.map((lang) => (
                      <option key={lang} value={lang.toLowerCase()}>
                        {lang}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Learning Language</span>
                  </label>
                  <select
                    name="learningLanguage"
                    value={formState.learningLanguage}
                    onChange={(e) => setFormState({ ...formState, learningLanguage: e.target.value })}
                    className="select select-bordered w-full"
                    required
                  >
                    <option value="">Select</option>
                    {LANGUAGES.map((lang) => (
                      <option key={lang} value={lang.toLowerCase()}>
                        {lang}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Location</span>
                </label>
                <div className="relative">
                  <MapPinIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 size-5 text-base-content opacity-50" />
                  <input
                    type="text"
                    name="location"
                    value={formState.location}
                    onChange={(e) => setFormState({ ...formState, location: e.target.value })}
                    className="input input-bordered w-full pl-10"
                    placeholder="Enter your location: City, Country"
                  />
                </div>
              </div>

              <button
                className="btn btn-primary w-full mt-6"
                disabled={isPending}
                type="submit"
              >
                {!isPending ? "Complete Profile" : 
                  <><span className="loading loading-spinner loading-xs"></span> Updating...</>}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;
