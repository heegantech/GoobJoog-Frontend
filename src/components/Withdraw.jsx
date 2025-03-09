import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { toast } from "react-hot-toast";
import { Navigate, useNavigate, useParams } from "react-router-dom";

const Withdraw = () => {
  const { method } = useParams();
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false); // New state for loading
  const navigate = useNavigate();

  const handleWithdraw = async (e) => {
    e.preventDefault();
    const userData = JSON.parse(localStorage.getItem("userData"));
    const access = userData.access;

    if (!access) {
      navigate("/login");
      return;
    }

    const formData = new FormData(e.target);
    const withdrawData = {
      wallet_name: method || "",
      phone_number: formData.get("phone_number"),
      amount: Number.parseFloat(formData.get("amount")),
    };

    const errors = {};

    if (isNaN(withdrawData.amount) || withdrawData.amount <= 0) {
      errors.amount = "Please enter a valid amount greater than zero";
    }

    if (Object.keys(errors).length > 0) {
      setErrors(errors);
      return false;
    }

    setIsLoading(true); // Set loading to true before making the request

    try {
      const response = await fetch("/api/payout/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access}`,
        },
        body: JSON.stringify(withdrawData),
      });

      const responseData = await response.json();

      if (response.ok) {
        toast.success(responseData.message);
        navigate("/");
      } else {
        throw new Error(responseData.message);
      }
    } catch (error) {
      toast.error(error.message);
      console.error("Error:", error);
    } finally {
      setIsLoading(false); // Set loading to false after the request is complete
    }
  };

  return (
    <div className="max-w-md mx-auto w-full mt-20 px-5">
      <Helmet>
        <title>Withdrawals</title>
      </Helmet>
      <h2 className="text-2xl  text-base-500 font-semibold text-primary-700 mb-6">
        Withdraw Funds
      </h2>
      <div className="mb-4 flex items-center gap-2">
        <img
          src={method === "evcplus" ? "/evc-plus.png" : "so.png"}
          width={40}
          height={16}
          className="border border-base-500 rounded-sm"
          alt="Wallet logo"
        />
        <span className="text-sm font-medium">{method.toUpperCase()}</span>
      </div>
      <form id="withdrawForm" onSubmit={handleWithdraw}>
        <div className="mb-4">
          <label
            htmlFor="withdrawAmount"
            className="block text-sm font-medium text-base-500 mb-1"
          >
            Amount
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-base-500">
              $
            </span>
            <input
              type="number"
              id="amount"
              name="amount"
              className="block w-full pl-7 pr-12 py-2 border border-base-500 rounded-md focus:ring-base-400 outline-base-500 focus:border-base-400"
              placeholder="0.00"
              disabled={isLoading} // Disable input when loading
            />
          </div>
          {errors.amount && (
            <span className="text-red-500 text-sm">{errors.amount}</span>
          )}
        </div>
        <div className="mb-4">
          <label
            htmlFor="phone_number"
            className="block text-sm font-medium text-base-500 mb-1"
          >
            Phone number
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
              type="number"
              id="phone_number"
              name="phone_number"
              min="0"
              step="0.01"
              required
              className="block w-full pl-24 pr-12 py-2 border border-base-500 rounded-md focus:ring-base-400 outline-base-400 focus:border-base-500"
              placeholder="61xxxxxxx"
              disabled={isLoading} // Disable input when loading
            />
          </div>
        </div>
        <button
          type="submit"
          className="w-full bg-base-500 text-white font-semibold py-3 px-4 rounded-xl hover:bg-base-500 transition duration-300"
          disabled={isLoading} // Disable button when loading
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
              <span className="ml-2">Processing...</span>
            </div>
          ) : (
            "Withdraw"
          )}
        </button>
      </form>
    </div>
  );
};

export default Withdraw;
