import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useUser";
import toast from "react-hot-toast";
import { BASE_URL } from "@/lib/base";

const Login = () => {
  const [loginData, setLoginData] = useState({
    phone_number: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { login, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/"); // Redirect to dashboard or home page
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`${BASE_URL}/auth/jwt/create/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData),
      });

      const data = response.status === 204 ? {} : await response.json();
      if (!response.ok) throw new Error(data.detail || "Login failed");

      login(data);
      toast.success("Login successfully.");
      navigate("/");
    } catch (error) {
      // ("Error:", error);
      toast(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 gap-0">
      {/* Left Column - Login Form */}
      <div className="flex items-center justify-center p-6 lg:p-8">
        <div className="w-full max-w-sm space-y-8">
          {/* Logo */}
          <div className="space-y-2 text-center">
            <img
              src={import.meta.env.VITE_REACT_LOGO_URL}
              className="w-14 h-14 mx-auto"
              alt="Logo"
            />
            <h1 className="text-4xl font-bold text-base-500 tracking-tight">
              Welcome back
            </h1>
            <p className="text-lg text-muted-foreground">Sign in to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Phone Input with Flag */}
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
                <input
                  type="tel"
                  placeholder="Phone number"
                  className="appearance-none border bg-white border-[#292a86] rounded-lg w-full py-3 px-3 pl-24"
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
              <input
                type="password"
                placeholder="Enter password"
                className="appearance-none border bg-white border-[#292a86] rounded-lg w-full py-3 px-3"
                value={loginData.password}
                onChange={(e) =>
                  setLoginData({ ...loginData, password: e.target.value })
                }
                required
              />
            </div>

            {/* Login Button */}
            <Button
              type="submit"
              className="w-full bg-base-500 hover:bg-[#8b8dce] text-white h-12 text-base font-medium"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Continue"}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>

            {/* Register Link */}
            <div className="text-center mt-4">
              <Link
                to="/register"
                className="text-sm text-[#292a86] hover:[#292a86] transition-colors"
              >
                Don't have an account? Register here
              </Link>
            </div>
          </form>
        </div>
      </div>

      {/* Right Column - Gradient Background */}
      <div className="hidden lg:block relative bg-gradient-to-br from-black via-gray-900 to-gray-800">
        <div className="absolute inset-0 bg-[linear-gradient(40deg,rgba(255,255,255,0.8)_0%,rgba(255,255,255,0)_30%)] opacity-20" />
        <div className="absolute inset-0 p-12 flex flex-col justify-between text-white">
          <div />
          <div className="space-y-4">
            <h2 className="text-3xl font-bold">Secure Payments</h2>
            <p className="text-lg text-gray-300 max-w-md">
              Fast, secure, and reliable payment services for all your
              transactions
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
