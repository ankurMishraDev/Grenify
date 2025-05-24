import { useState } from "react";
import { MessageSquareText } from "lucide-react";
import { Link } from "react-router";
const SignUpPage = () => {
  const [signupData, setSignupData] = useState({
    fullName: "",
    email: "",
    password: "",
  });
  const handleSignup = (e) => {
    e.preventDefault();
  };
  return (
    <div
      className="flex h-screen items-center justify-center p-4 sm:p-6 md:p-8"
      data-theme="wireframe"
    >
      <div
        className="border border-primary/25 flex flex-col lg:flex-row w-full max-w-5xl 
        mx-auto bg-base-100 rounded-xl shadow-lg overflow-hidden"
      >
        {/* Left side*/}
        <div className="w-full lg:w-1/2 p-4 sm:p-8 flex flex-col">
          {/*Logo  */}
          <div className="mb-4 flex items-center justify-start gap-2">
            <MessageSquareText className="size-9 text-primary" />
            <span
              className="text-3xl font-bold font-mono bg-clip-text text-transparent 
                bg-gradient-to-r from-primary to-secondary tracking-wider"
            >
              Grenify
            </span>
          </div>
          {/* Form */}
          <div className="w-full">
            <form onSubmit={handleSignup}>
              <div className="space-y-4">
                <div>
                  <h2 className="text-xl font-semibold">Create an Account</h2>
                  <p className="text-sm opacity-80">
                    {" "}
                    Join Grenify and start your adventure!{" "}
                  </p>
                </div>
                <div className="space-y-3">
                  <div className="form-control w-full">
                    <label className="label">
                      <span className="label-text">Full Name:</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Greninja"
                      className="input input-bordered w-full"
                      value={signupData.fullName}
                      onChange={(e)=>setSignupData({...signupData, fullName: e.target.value})}
                      required
                    />
                  </div>
                </div>
                {/* Email */}
                 <div className="space-y-3">
                  <div className="form-control w-full">
                    <label className="label">
                      <span className="label-text">Email:</span>
                    </label>
                    <input
                      type="email"
                      placeholder="gre@xyz.com"
                      className="input input-bordered w-full"
                      value={signupData.email}
                      onChange={(e)=>setSignupData({...signupData, email: e.target.value})}
                      required
                    />
                  </div>
                </div>
                {/* Password */}
                 <div className="space-y-3">
                  <div className="form-control w-full">
                    <label className="label">
                      <span className="label-text">Password:</span>
                    </label>
                    <input
                      type="text"
                      placeholder="********"
                      className="input input-bordered w-full"
                      value={signupData.password}
                      onChange={(e)=>setSignupData({...signupData, password: e.target.value})}
                      required
                    />
                    <p className="text-xs opacity-70 mt-1">
                      Password must be at least 6 characters long and contain a mix of letters, numbers, and symbols.
                    </p>
                  </div>
                </div>
                {/* Submit Button */}
                <button className="btn btn-primary w-full" type="submit">Create Account</button>
                <div className="text-center mt-4">
                  <p className="text-sm">Already have an account?{" "}<Link to="/login" className="text-primary hover:underline">Sign in</Link></p>
                </div>
                
              </div>
            </form>
          </div>
        </div>

        {/* Right side */}
        <div className="hidden lg:flex w-full lg:w-1/2 bg-primary/10 items-center justify-center">
        <div className="max-w-md p-8">
          {/* Illustration or Image */}
          <div className="relative aspect-square max-w-sm mx-auto">
            <img src="/signupImage.png" alt="Connection Illustration" className="w-full h-full" />
          </div>
          <div className="text-center space-y-3 mt-6">
            <h2 className="text-xl font-semibold">Connect with people from anywhere</h2>
            <p className="opacity-70">Interact with people and grow together</p>
          </div>
        </div>
        </div>
        
      </div>
    </div>
  );
};

export default SignUpPage;
