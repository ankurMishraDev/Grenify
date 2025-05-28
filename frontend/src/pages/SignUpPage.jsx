import { useState, useEffect, useCallback, useMemo } from "react";
import { MessageSquareText } from "lucide-react";
import { Link } from "react-router-dom";

import useSignup from "../hooks/useSignup";

const images = [
  {
    src: "/signupImage4.png",
    title: "Connect with people from anywhere",
    description: "Interact with people and grow together",
  },
  {
    src: "/signupImage1.png",
    title: "Build meaningful relationships",
    description: "Create lasting connections that matter",
  },
  {
    src: "/signupImage3.png",
    title: "Share experiences together",
    description: "Discover new perspectives and ideas",
  },
  {
    src: "/signupImage2.svg",
    title: "Join a vibrant community",
    description: "Be part of something bigger than yourself",
  },
];

const SignUpPage = () => {
  const [signupData, setSignupData] = useState({
    fullName: "",
    email: "",
    password: "",
  });
  const { isPending, error, mutate } = useSignup();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Memoize current image for performance
  const currentImage = useMemo(
    () => images[currentImageIndex],
    [currentImageIndex]
  );

  // Carousel effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 7000);
    return () => clearInterval(interval);
  }, []);

  // Unified input handler
  const handleInputChange = useCallback(
    (e) => {
      const { name, value } = e.target;
      setSignupData((prev) => ({ ...prev, [name]: value }));
    },
    []
  );

  // Form submit
  const handleSignup = useCallback(
    (e) => {
      e.preventDefault();
      mutate(signupData);
    },
    [mutate, signupData]
  );

  return (
    <div
      className="flex h-screen items-center justify-center p-4 sm:p-6 md:p-8"
      data-theme="wireframe"
    >
      <div className="border border-primary/25 flex flex-col lg:flex-row w-full max-w-5xl mx-auto bg-base-100 rounded-xl shadow-lg overflow-hidden">
        {/* Left side */}
        <div className="w-full lg:w-1/2 p-4 sm:p-8 flex flex-col">
          {/* Logo */}
          <div className="mb-4 flex items-center justify-start gap-2">
            <MessageSquareText className="size-9 text-primary" />
            <span className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider">
              Grenify
            </span>
          </div>
          {/* Error message */}
          {error && (
            <div className="alert alert-error mb-4">
              <span>
                {error.response?.data?.message ||
                  error.message ||
                  "Signup failed"}
              </span>
            </div>
          )}
          {/* Form */}
          <div className="w-full">
            <form onSubmit={handleSignup} autoComplete="on">
              <div className="space-y-4">
                <div>
                  <h2 className="text-xl font-semibold">Create an Account</h2>
                  <p className="text-sm opacity-80">
                    Join Grenify and start your adventure!
                  </p>
                </div>
                {/* Full Name */}
                <div className="form-control w-full">
                  <label className="label" htmlFor="fullName">
                    <span className="label-text">Full Name:</span>
                  </label>
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    placeholder="Greninja"
                    className="input input-bordered w-full"
                    value={signupData.fullName}
                    onChange={handleInputChange}
                    required
                    autoComplete="name"
                  />
                </div>
                {/* Email */}
                <div className="form-control w-full">
                  <label className="label" htmlFor="email">
                    <span className="label-text">Email:</span>
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="gre@xyz.com"
                    className="input input-bordered w-full"
                    value={signupData.email}
                    onChange={handleInputChange}
                    required
                    autoComplete="email"
                  />
                </div>
                {/* Password */}
                <div className="form-control w-full">
                  <label className="label" htmlFor="password">
                    <span className="label-text">Password:</span>
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="********"
                    className="input input-bordered w-full"
                    value={signupData.password}
                    onChange={handleInputChange}
                    required
                    minLength={6}
                    autoComplete="new-password"
                  />
                  <p className="text-xs opacity-70 mt-1">
                    Password must be at least 6 characters long and contain a mix
                    of letters, numbers, and symbols.
                  </p>
                </div>
                {/* Submit Button */}
                <button
                  className="btn btn-primary w-full"
                  type="submit"
                  disabled={isPending}
                  aria-busy={isPending}
                >
                  {isPending ? (
                    <>
                      <span className="loading loading-spinner loading-xs"></span>{" "}
                      Wait a second..
                    </>
                  ) : (
                    "Create Account"
                  )}
                </button>
                <div className="text-center mt-4">
                  <p className="text-sm">
                    Already have an account?{" "}
                    <Link
                      to="/login"
                      className="text-primary hover:underline"
                    >
                      Sign in
                    </Link>
                  </p>
                </div>
              </div>
            </form>
          </div>
        </div>
        {/* Right side */}
        <div className="hidden lg:flex w-full lg:w-1/2 bg-primary/10 items-center justify-center">
          <div className="max-w-md p-8">
            {/* Image with smooth transition */}
            <div className="relative aspect-square w-full max-w-[36.8rem] mx-auto overflow-hidden rounded-lg bg-base-100">
              {images.map((image, index) => (
                <img
                  key={index}
                  src={image.src}
                  alt={image.title}
                  className={`absolute top-0 left-0 w-full h-full object-cover transform-gpu transition-opacity duration-1000 ease-in-out ${
                    index === currentImageIndex
                      ? "opacity-100 z-10"
                      : "opacity-0 z-0"
                  }`}
                  draggable={false}
                />
              ))}
            </div>
            {/* Dynamic text content */}
            <div className="text-center space-y-3 mt-6">
              <h2 className="text-xl font-semibold transition-opacity duration-500">
                {currentImage.title}
              </h2>
              <p className="opacity-70 transition-opacity duration-500">
                {currentImage.description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
