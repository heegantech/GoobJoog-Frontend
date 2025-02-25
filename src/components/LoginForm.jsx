import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useUser";
import toast from "react-hot-toast";

const Login = () => {
  const [loginData, setLoginData] = useState({
    phone_number: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("https://api.barrowpay.com/auth/jwt/create/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.detail);

      login(data);
      toast.success("Login successful.");
      navigate("/");
    } catch (error) {
      console.error("Error:", error);
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gray-50 flex flex-col">
      {/* Full-width Circular Curved Image */}
      <div className="relative w-full h-64 overflow-hidden rounded-b-full bg-gradient-to-r from-blue-500 to-green-500">
        <img
          src="https://techafricanews.com/wp-content/uploads/2022/11/african-businessman-talking-on-phone-sitting-at-la-2022-10-07-03-02-54-utc-small.jpg" // Replace with your image URL
          alt="Logo"
          className="object-cover w-full h-full absolute top-0 left-0"
          style={{
            clipPath: "circle(50% at 50% 50%)", // Creating a circular effect on the image
          }}
        />
      </div>

      {/* Login Form */}
      <div className="flex flex-col items-center justify-center py-10 px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold text-green-600">Welcome back</h1>
            <p className="text-lg text-gray-600">Sign in to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Phone Number Input with Flag */}
            <div className="space-y-2">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4">
                  <div className="flex items-center gap-2 pr-3 border-r">
                    <img
                      src="https://flagcdn.com/w40/so.png"
                      width={22}
                      height={16}
                      alt="Somalia flag"
                      className="rounded-sm"
                    />
                    <span className="text-sm font-medium">+252</span>
                  </div>
                </div>
                <Input
                  type="tel"
                  placeholder="Phone number"
                  className="pl-[108px] py-5"
                  value={loginData.phone_number}
                  onChange={(e) =>
                    setLoginData({ ...loginData, phone_number: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <Input
                type="password"
                placeholder="Enter password"
                className="py-5"
                value={loginData.password}
                onChange={(e) =>
                  setLoginData({ ...loginData, password: e.target.value })
                }
                required
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-500 text-white h-12 text-base font-medium"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Continue"}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>

            {/* Help Link */}
            <div className="text-center mt-4">
              <Link
                href="#"
                className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                Need help signing in?
              </Link>
            </div>

            {/* Register Link */}
            <div className="text-center mt-4">
              <Link
                to="/register"
                className="text-sm text-green-600 hover:text-green-700 transition-colors"
              >
                Don't have an account? Register here
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
