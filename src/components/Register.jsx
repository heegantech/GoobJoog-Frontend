import { Lock, User } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../hooks/useUser";
import { BASE_URL, LOGO } from "@/lib/base";

const Register = () => {
  const [registerData, setRegisterData] = useState({
    full_name: "",
    phone_number: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const validatePhoneNumber = (phone) => {
    const phonePattern = /^(07\d{7}|61\d{7})$/;
    return phonePattern.test(phone);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validatePhoneNumber(registerData.phone_number)) {
      setError("Phone number must be 9 digits and start with 07 or 61.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      // Register the user
      const registerResponse = await fetch(`${BASE_URL}/auth/users/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(registerData),
      });

      if (!registerResponse.ok) {
        const data = await registerResponse.json();
        const errorMessage =
          data.full_name?.[0] ||
          data.phone_number?.[0] ||
          data.password?.[0] ||
          "Registration failed.";
        toast(errorMessage);
        return;
      }

      // Automatically log in the user after registration
      const loginResponse = await fetch(`${BASE_URL}/auth/jwt/create/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phone_number: registerData.phone_number,
          password: registerData.password,
        }),
      });

      if (!loginResponse.ok) {
        toast("Login failed after registration.");
        return;
      }

      const loginData = await loginResponse.json();
      login(loginData); // Use the login function from useAuth to set user state
      navigate("/"); // Redirect to the home page
      toast.success("Account created and logged in successfully.");
    } catch (error) {
      toast("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md px-4">
        <div className="text-start mb-8">
          <img src="./logo.png" className="w-10 h-10" alt="" />

          <p className="text-base-500 mt-2">Create your account below.</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold mb-2" htmlFor="fullName">
              Full Name
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <User className="w-5 h-5 text-gray-500" />
              </span>
              <input
                className="border bg-white rounded-lg w-full py-3 px-3 pl-10 text-primary-700 focus:ring-2 focus:ring-base-500"
                id="fullName"
                type="text"
                placeholder="Enter your full name"
                value={registerData.full_name}
                onChange={(e) =>
                  setRegisterData({
                    ...registerData,
                    full_name: e.target.value,
                  })
                }
              />
            </div>
          </div>

          <div>
            <label
              className="block text-sm font-bold mb-2"
              htmlFor="phoneNumber"
            >
              Phone Number
            </label>
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
                className="border bg-white rounded-lg w-full py-3 px-3 pl-24 text-primary-700 focus:ring-2 focus:ring-base-500"
                id="phoneNumber"
                type="tel"
                placeholder="Enter your phone number"
                value={registerData.phone_number}
                onChange={(e) =>
                  setRegisterData({
                    ...registerData,
                    phone_number: e.target.value,
                  })
                }
              />
            </div>
            {error && <p className="text-red-600 text-sm">{error}</p>}
          </div>

          <div>
            <label className="block text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <Lock className="w-5 h-5 text-gray-500" />
              </span>
              <input
                className="border bg-white rounded-lg w-full py-3 px-3 pl-10 text-primary-700 focus:ring-2 focus:ring-base-500"
                id="password"
                type="password"
                placeholder="Enter your password"
                value={registerData.password}
                onChange={(e) =>
                  setRegisterData({ ...registerData, password: e.target.value })
                }
              />
            </div>
          </div>

          <button
            className="w-full bg-base-500 hover:bg-base-400 text-white font-bold py-3 px-4 rounded-lg focus:outline-none transition duration-300"
            type="submit"
            disabled={loading}
          >
            {loading ? "Signing Up..." : "Sign Up"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
