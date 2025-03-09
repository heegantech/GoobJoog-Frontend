import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { Helmet } from "react-helmet";

const Deposit = ({ closeModal, fetchBalance, pendingPayment }) => {
  const { method } = useParams();
  const [paymentMethod, setPaymentMethod] = useState("");
  const [showInstructions, setShowInstructions] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Loading state for the button

  const [depositData, setDepositData] = useState({
    wallet_name: method || "",
    amount: "",
    phone_number: "", // Initially empty phone number
  });

  const [errors, setErrors] = useState({});
  const [logedUser, setLogedUser] = useState(null);

  const navigate = useNavigate();

  const handlePaymentMethodChange = (event) => {
    const selectedMethod = event.target.value;
    setPaymentMethod(selectedMethod);
    setShowInstructions(true); // Show instructions when a method is selected
    setDepositData((prevData) => ({
      ...prevData,
      wallet_name: selectedMethod,
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDepositData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleCopyUSSD = () => {
    const ussdCode = `*712*${depositData.phone_number}*${depositData.amount}#`; // Updated USSD code
    navigator.clipboard.writeText(ussdCode).then(() => {
      setCopySuccess(true);
      setTimeout(() => {
        setCopySuccess(false);
      }, 2000);
    });
  };

  const validate = () => {
    if (isNaN(depositData.amount) || depositData.amount <= 0) {
      setErrors("Please enter a valid amount greater than zero");
      return false;
    }
    return;
  };

  const handleDeposit = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Start loading

    const userData = JSON.parse(localStorage.getItem("userData"));
    const access = userData.access;

    const errors = {};

    if (isNaN(depositData.amount) || depositData.amount <= 0) {
      errors.amount = "Please enter a valid amount greater than zero";
    }

    if (Object.keys(errors).length > 0) {
      setErrors(errors);
      setIsLoading(false); // Stop loading if validation fails
      return false;
    }

    try {
      const response = await fetch("https://api.goobjoogpay.com/api/deposit/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access}`,
        },
        body: JSON.stringify(depositData),
      });

      const responseData = await response.json();

      if (response.ok) {
        toast.success(responseData.message);
        setDepositData({
          wallet_name: "",
          amount: "",
          phone_number: "",
        });

        // Redirect to USSD dialer only for specific wallets
        const redirectWallets = ["evcplus", "edahab", "sahal", "golis"];
        if (redirectWallets.includes(depositData.wallet_name)) {
          setTimeout(() => {
            window.location.href = `tel:*712*0615761226*${depositData.amount}#`; // Updated USSD code
          }, 3000); // Delay redirection for 3 seconds
        }

        // Navigate to home page after successful deposit
        setTimeout(() => {
          navigate("/");
        }, 3000);
      } else {
        throw new Error(responseData.message || "Deposit failed");
      }
    } catch (error) {
      toast.error(error.message);
      console.error("Error:", error);
    } finally {
      setIsLoading(false); // Stop loading after request completes
    }
  };

  const userMe = async () => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    const access = userData.access;
    try {
      const response = await fetch("/auth/users/me/", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${access}`,
        },
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setLogedUser(data);
    } catch (error) {
      // console.error("Error:", error);
    }
  };

  useEffect(() => {
    userMe();
  }, []);

  useEffect(() => {
    if (logedUser && logedUser.phone_number) {
      setDepositData((prevData) => ({
        ...prevData,
        phone_number: logedUser.phone_number, // Set the phone number from the API response
      }));
    }
  }, [logedUser]);

  return (
    <div className="max-w-md mx-auto w-full h-[670px] mt-20 px-5">
      <Helmet>
        <title>Deposit</title>
      </Helmet>
      <h2 className="text-2xl font-semibold text-base-500 mb-6">
        Deposit Funds
      </h2>
      <div className="mb-4 flex items-center gap-2">
        <img
          src="https://cdn-icons-png.flaticon.com/512/8074/8074045.png"
          width={40}
          height={16}
          className="border border-base-500 rounded-sm"
          alt=""
        />
        <span className="text-sm font-medium">{method.toUpperCase()}</span>
      </div>
      {/* Deposit Form */}
      <form onSubmit={handleDeposit}>
        <div className="mb-4">
          <label
            htmlFor="amount"
            className="block text-sm font-medium text-primary-700 mb-1"
          >
            Amount
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-primary-500">
              $
            </span>
            <input
              type="number"
              id="amount"
              name="amount"
              value={depositData.amount}
              className="block w-full pl-7 pr-12 py-2 border border-base-500 rounded-md focus:ring-primary-500 focus:border-primary-500"
              placeholder="0.00"
              onChange={handleInputChange}
            />
          </div>
          {errors.amount && (
            <span className="text-red-500 text-sm">{errors.amount}</span>
          )}
        </div>
        <div className="mb-4">
          {method === "usdt" ? (
            <label htmlFor="phone_number">USDT Address</label>
          ) : (
            <label htmlFor="phone_number">Phone Number</label>
          )}

          <div className="relative">
            {method === "ebirr" ? (
              <div className="absolute inset-y-0 left-0 flex items-center pl-4">
                <div className="flex items-center gap-2 pr-3 border-r">
                  <img
                    src="https://flagcdn.com/w40/et.png"
                    width={22}
                    height={16}
                    alt="Somalia flag"
                    className="rounded-sm"
                  />
                  <span className="text-sm font-medium">+251</span>
                </div>
              </div>
            ) : method === "Mpesa" ? (
              <div className="absolute inset-y-0 left-0 flex items-center pl-4">
                <div className="flex items-center gap-2 pr-3 border-r">
                  <img
                    src="https://flagcdn.com/w40/ke.png"
                    width={22}
                    height={16}
                    alt="Somalia flag"
                    className="rounded-sm"
                  />
                  <span className="text-sm font-medium">+254</span>
                </div>
              </div>
            ) : method === "usdt" ? (
              <></>
            ) : (
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
            )}
            {method === "usdt" ? (
              <input
                type="text"
                id="phone_number"
                name="phone_number"
                value={depositData.phone_number}
                onChange={handleInputChange}
                className="block w-full pl-2  pr-12 py-2 border border-base-500 rounded-md focus:ring-base-400 outline-base-500 focus:border-base-400"
                placeholder="USDT Adress"
              />
            ) : (
              <input
                type="text" // Changed from "number" to "text" to allow non-numeric characters (like "+" sign)
                id="phone_number"
                name="phone_number"
                value={logedUser?.phone_number || depositData.phone_number}
                readOnly // Make the field readonly
                className="block w-full pl-24 pr-12 py-2 border border-base-500 rounded-md focus:ring-primary-500 focus:border-primary-500"
                placeholder="61635353"
                onChange={handleInputChange}
              />
            )}
          </div>
        </div>

        {/* Instructions section */}
        {showInstructions && (
          <div className="mb-4 p-4 border border-base-500 bg-gray-50 rounded-md">
            <h3 className="text-sm font-semibold text-primary-700 mb-2">
              Instructions
            </h3>
            <p className="text-sm text-primary-600">
              To make a deposit, please use the USSD code below:
              <br />
              <strong>*712*0615761226*{depositData.amount}#</strong>
            </p>
            <button
              type="button"
              className="mt-2 text-blue-500 text-sm"
              onClick={handleCopyUSSD}
            >
              {copySuccess ? "Copied!" : "Copy USSD Code"}
            </button>
          </div>
        )}

        <div className="flex gap-4">
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
              "Deposit"
            )}
          </button>
        </div>
      </form>

      {/* Deposit Summary Table (Moved down and dashed borders) */}
      <div className="mt-6">
        <h3 className="text-xl font-semibold text-primary-700 mb-2">
          Deposit Summary
        </h3>
        <table className="min-w-full table-auto">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left font-medium text-primary-600 border-b-2 border-base-500 border-dashed">
                Field
              </th>
              <th className="px-4 py-2 text-left font-medium text-primary-600 border-b-2 border-base-500 border-dashed">
                Value
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="px-4 py-2 border-base-400 text-primary-600 border-b border-dashed">
                Wallet Method
              </td>
              <td className="px-4 py-2 border-base-400 text-primary-600 border-b border-dashed">
                {depositData.wallet_name}
              </td>
            </tr>
            <tr>
              <td className="px-4 py-2 border-base-400 text-primary-600 border-b border-dashed">
                Amount
              </td>
              <td className="px-4 py-2 border-base-400 text-primary-600 border-b border-dashed">
                ${depositData.amount}
              </td>
            </tr>
            <tr>
              <td className="px-4 py-2 border-base-400 text-primary-600 border-b border-dashed">
                Phone Number
              </td>
              <td className="px-4 py-2 border-base-400 text-primary-600 border-b border-dashed">
                {depositData.phone_number}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Deposit;
