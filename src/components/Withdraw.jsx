import React from "react";
import { toast } from "react-hot-toast";
import { Navigate, useNavigate, useParams } from "react-router-dom";

const Withdraw = ({ closeModal, fetchBalance, pendingPayment }) => {
  const { method } = useParams();

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
      phone_number:formData.get("phone_number"),
      amount: Number.parseFloat(formData.get("amount")),
    };

    try {
      const response = await fetch("https://api.barrowpay.com/api/payout/", {
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
    }
  };

  if (method !== "evcplus") {
    return (
      <div className="mt-20 px-5">
        <h2 className="text-xl font-semibold text-primary-700">Coming Soon</h2>
      </div>
    );
  }

  return (
    <div className="mt-20 px-5">
      <form id="withdrawForm" onSubmit={handleWithdraw}>
        <div className="mb-4">
          <label
            htmlFor="withdrawAmount"
            className="block text-sm font-medium text-green-700 mb-1"
          >
            Amount
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-green-500">
              $
            </span>
            <input
              type="number"
              id="amount"
              name="amount"
              min="0"
              step="0.01"
              required
              className="block w-full pl-7 pr-12 py-2 border-green-300 rounded-md focus:ring-green-500 outline-green-500 focus:border-green-500"
              placeholder="0.00"
            />
          </div>
        </div>
        <div className="mb-4">
          <label
            htmlFor="phone_number"
            className="block text-sm font-medium text-green-700 mb-1"
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
              className="block w-full pl-24 pr-12 py-2 border-green-300 rounded-md focus:ring-green-500 outline-green-500 focus:border-green-500"
              placeholder="61xxxxxxx"
            />
          </div>
        </div>
        <button
          type="submit"
          className="w-full bg-green-600 text-white font-semibold py-3 px-4 rounded-xl hover:bg-green-700 transition duration-300"
        >
          Withdraw
        </button>
      </form>
    </div>
  );
};

export default Withdraw;
