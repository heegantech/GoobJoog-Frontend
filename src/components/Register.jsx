import { Lock, User, Mail, Phone } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const [registerData, setRegisterData] = useState({
    full_name: "",
    phone_number: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("https://api.barrowpay.com/api/register/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          full_name: registerData.full_name,
          email: registerData.email,
          phone_number: registerData.phone_number,
          password: registerData.password,
        }),
      });
      const data = await response.json();
      console.log("Success:", data);
      navigate("/login");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md px-4">
        <div className="text-start mb-8">
          <h1 className="text-4xl font-bold text-green-600">Barrow Pay</h1>
          <p className="text-green-600 mt-2 ">Create your account below.</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              className="block text-green-700 text-sm font-bold mb-2"
              htmlFor="fullName"
            >
              Full Name
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <User className="w-5 h-5 text-green-700" />
              </span>
              <input
                className="appearance-none border bg-white border-green-300 rounded-lg w-full py-3 px-3 pl-10 text-primary-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                id="fullName"
                type="text"
                placeholder="Enter your full name"
                value={registerData.fullName}
                // onChange={(e) => setFullName(e.target.value)}
                onChange={(e) =>
                  setRegisterData({ ...registerData, fullName: e.target.value })
                }
              />
            </div>
          </div>

          <div>
            <label
              className="block text-green-700 text-sm font-bold mb-2"
              htmlFor="phoneNumber"
            >
              Phone Number
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <Phone className="w-5 h-5 text-green-700" />
              </span>
              <input
                className="appearance-none border bg-white border-green-300 rounded-lg w-full py-3 px-3 pl-10 text-primary-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                id="phoneNumber"
                type="tel"
                placeholder="Enter your phone number"
                value={registerData.phoneNumber}
                // onChange={(e) => setPhoneNumber(e.target.value)}
                onChange={(e) =>
                  setRegisterData({
                    ...registerData,
                    phoneNumber: e.target.value,
                  })
                }
              />
            </div>
          </div>
          <div>
            <label
              className="block text-green-700 text-sm font-bold mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <Lock className="w-5 h-5 text-green-700" />
              </span>
              <input
                className="appearance-none bg-white border border-green-300 rounded-lg w-full py-3 px-3 pl-10 text-primary-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                id="password"
                type="password"
                placeholder="Enter your password"
                value={registerData.password}
                // onChange={(e) => setPassword(e.target.value)}
                onChange={(e) =>
                  setRegisterData({ ...registerData, password: e.target.value })
                }
              />
            </div>
          </div>
          <div>
            <button
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg focus:outline-none transition duration-300"
              type="submit"
            >
              Sign Up
            </button>
          </div>
        </form>
        <p className="text-center text-primary-600 text-sm mt-6">
          Already have an account?{" "}
          <Link to="/login" className="font-bold hover:text-primary-700">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
