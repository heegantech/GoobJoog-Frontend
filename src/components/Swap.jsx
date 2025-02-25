import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Swap = () => {
  const [swapData, setSwapData] = useState({
    from_wallet: "",
    to_wallet: "",
    swap_address: "",
    amount: "",
  });
  const [swapRate, setSwapRate] = useState(null); // State to store the swap rate
  const [swapFee, setSwapFee] = useState(null); // State to store the swap fee
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch swap rate when the component mounts or when relevant values change
    const fetchSwapRate = async (from_wallet, to_wallet) => {
      const userData = JSON.parse(localStorage.getItem("userData"));
      const access = userData?.access; // Safely access the access token

      if (!access) {
        navigate("https://api.barrowpay.com/login");
        return;
      }

      if (!from_wallet || !to_wallet) {
        toast.error(
          "Please provide both 'from_wallet' and 'to_wallet' parameters."
        );
        return;
      }

      try {
        const response = await fetch(
          "https://api.barrowpay.com/api/swap-rate/",
          {
            method: "POST", // Changed to POST request
            headers: {
              "Content-Type": "application/json", // Correct content type for POST
              Authorization: `Bearer ${access}`, // Pass the authorization token
            },
            body: JSON.stringify({
              from_wallet: from_wallet,
              to_wallet: to_wallet,
            }),
          }
        );

        // Check if the response is ok
        if (!response.ok) {
          throw new Error("Failed to fetch swap rate");
        }

        const data = await response.json();

        // Set the swap rate and fee
        setSwapRate(data?.swap_rate || 0); // Ensure the rate is correctly set
        // setSwapFee(data?.swap_rate || 0); // Ensure the fee is correctly set
      } catch (error) {
        console.error("Error fetching swap rate:", error);
        toast.error("Failed to fetch swap rate");
      }
    };

    // Call fetchSwapRate when the component is mounted or when the wallet values or amount changes
    if (swapData.from_wallet && swapData.to_wallet && swapData.amount) {
      fetchSwapRate(swapData.from_wallet, swapData.to_wallet);
    }
  }, [swapData.from_wallet, swapData.to_wallet, swapData.amount]); // Re-run the effect when from_wallet, to_wallet, or amount changes

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSwapData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

const handleSwap = async (e) => {
  e.preventDefault();

  if (!swapData.from_wallet || !swapData.to_wallet) {
    toast.error("Please provide both 'From' and 'To' wallet values.");
    return;
  }

  const userData = JSON.parse(localStorage.getItem("userData"));
  const access = userData.access;

  try {
    const response = await fetch("https://api.barrowpay.com/api/swap/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access}`,
      },
      body: JSON.stringify(swapData),
    });

    const responseData = await response.json();
    if (response.ok) {
      toast.success(responseData.message || "Swap successful");
      
      // Format WhatsApp message
      const adminPhoneNumber = "252616555736"; // Replace with actual number
      const formattedMessage = `🔄 *New Swap Created* 🔄\n\n`
        + `📌 *From Wallet:* ${swapData.from_wallet}\n`
        + `📌 *To Wallet:* ${swapData.to_wallet}\n`
        + `📌 *Swap Address:* ${swapData.swap_address}\n`
        + `📌 *Amount:* ${swapData.amount}\n`
        + `📌 *Swap Fee:* ${swapRate * 100}%\n`
        + `📌 *Total to Receive:* ${swapData.amount - swapData.amount * swapRate}\n\n`
        + `✅ Please review the transaction.`;

      // Open WhatsApp with the pre-filled message
      const whatsappURL = `https://wa.me/${adminPhoneNumber}?text=${encodeURIComponent(formattedMessage)}`;
      window.open(whatsappURL, "_blank");

      navigate("/");
      setSwapData({
        from_wallet: "",
        to_wallet: "",
        swap_address: "",
        amount: "",
      });
    } else {
      throw new Error(responseData.message || "Swap failed");
    }
  } catch (error) {
    toast.error(error.message);
    console.error("Error:", error);
  }
};


  // Calculate the total amount to receive after applying the swap fee
  const totalReceive =
    swapData.amount >= 1 && swapFee
      ? parseFloat(swapData.amount) - swapFee * 100
      : 0;

  return (
    <div className="mt-20 px-5 h-[800px]">
      <form onSubmit={handleSwap}>
        <div className="mb-4">
          <label
            htmlFor="fromCurrency"
            className="block text-sm font-medium text-green-700 mb-1"
          >
            From
          </label>
          <select
            id="from_wallet"
            name="from_wallet"
            required
            onChange={handleChange}
            className="block w-full py-2 px-3 border border-green-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
          >
            <option value="">Select A wallet</option>
            <option value="evcplus">EVC PLUS</option>
          </select>
        </div>
        <div className="mb-4">
          <label
            htmlFor="toCurrency"
            className="block text-sm font-medium text-green-700 mb-1"
          >
            To
          </label>
          <select
            id="to_wallet"
            name="to_wallet"
            required
            onChange={handleChange}
            className="block w-full py-2 px-3 border border-green-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
          >
            <option value="">Select A wallet</option>
            <option value="usdt">USDT</option>
          </select>
        </div>
        <div className="mb-4">
          <label
            htmlFor="swapAddress"
            className="block text-sm font-medium text-green-700 mb-1"
          >
            Swap Address
          </label>
          <input
            type="text"
            id="swap_address"
            name="swap_address"
            required
            onChange={handleChange}
            className="block w-full py-2 px-3 border border-green-300 rounded-md focus:ring-green-500 focus:border-green-500"
            placeholder="Enter swap address"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="swapAmount"
            className="block text-sm font-medium text-green-700 mb-1"
          >
            Amount
          </label>
          <input
            type="number"
            id="amount"
            name="amount"
            min="0"
            step="0.01"
            onChange={handleChange}
            required
            className="block w-full py-2 px-3 border border-green-300 rounded-md focus:ring-green-500 focus:border-green-500"
            placeholder="0.00"
          />
        </div>
        {/* Display the swap summary when amount is entered */}
        {swapData.amount && (
          <div className="mt-6 p-5 border-2 border-dashed border-green-600 rounded-md">
            <h3 className="text-lg font-semibold text-green-700 mb-2">
              Swap Summary
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="font-medium">From To Wallet:</span>
                <span>{swapData.from_wallet}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">To Wallet:</span>
                <span>{swapData.to_wallet}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Swap Address:</span>
                <span>{swapData.swap_address}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Amount:</span>
                <span>{swapData.amount}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Swap Fee:</span>
                <span>{swapRate * 100}%</span>
              </div>
              <div className="flex justify-between font-bold text-green-700">
                <span>Total to Receive:</span>
                <span>{swapData.amount - swapData.amount * swapRate}</span>
              </div>
            </div>
          </div>
        )}

        {/* Display the swap rate
        {swapRate && (
          <p className="text-sm text-gray-500 mt-4">Swap Rate: {swapRate}</p>
        )} */}
        <button
          type="submit"
          className="w-full bg-green-600 text-white font-semibold py-3 px-4 rounded-xl hover:bg-green-700 transition duration-300 mt-4"
        >
          Swap
        </button>
      </form>
    </div>
  );
};

export default Swap;
