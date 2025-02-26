import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
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
        navigate("/login");
        return;
      }

      if (!from_wallet || !to_wallet) {
        toast.error(
          "Please provide both 'from_wallet' and 'to_wallet' parameters."
        );
        return;
      }

      try {
        const response = await fetch("/api/swap-rate/", {
          method: "POST", // Changed to POST request
          headers: {
            "Content-Type": "application/json", // Correct content type for POST
            Authorization: `Bearer ${access}`, // Pass the authorization token
          },
          body: JSON.stringify({
            from_wallet: from_wallet,
            to_wallet: to_wallet,
          }),
        });

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
    const access = userData?.access;
    const username = userData?.username || "Unknown User";

    // Admin phone number
    const adminPhoneNumber = "0615761226";

    // Calculate amounts
    const swapFee = swapData.amount * swapRate;
    const totalReceive = swapData.amount - swapFee;

    // Format WhatsApp message
    const formattedMessage =
      `🔄 *New Swap Created* 🔄\n\n` +
      `👤 *User:* ${username}\n` +
      `----------------------------------\n` +
      `📌 *Transaction Details:*\n` +
      `----------------------------------\n` +
      `| *Field*            | *Value*           |\n` +
      `|----------------|----------------|\n` +
      `| From Wallet    | ${swapData.from_wallet} |\n` +
      `| To Wallet      | ${swapData.to_wallet} |\n` +
      `| Swap Address   | ${swapData.swap_address} |\n` +
      `| Amount         | $${swapData.amount} |\n` +
      `| Swap Fee       | $${swapFee} (${swapRate * 100}%) |\n` +
      `| Total Receive  | $${totalReceive} |\n` +
      `----------------------------------\n` +
      `✅ *Please review the transaction.*`;

    try {
      // Before sending the WhatsApp message, fetch the swap
      const response = await fetch("https://api.goobjoogpay.com/api/swap/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access}`,
        },
        body: JSON.stringify(swapData),
      });

      const responseData = await response.json();

      if (response.ok) {
        // Success - Open WhatsApp link
        setTimeout(
          () =>
            window.open(
              `https://wa.me/${adminPhoneNumber}?text=${encodeURIComponent(
                formattedMessage
              )}`,
              "_blank"
            ),
          500
        ); // Smooth UX

        toast.success(responseData.message || "Swap successful");
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
      // Handle errors
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

    <div className="mt-20 px-5 max-w-lg mx-auto">
      <Helmet>
        <title>Swap</title>
      </Helmet>
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Swap</h2>
      <Card className="p-6 shadow-lg rounded-2xl">
        <form onSubmit={handleSwap} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">From</label>
            <Select id="from_wallet" name="from_wallet" required onChange={handleChange}>
              <SelectItem value="" disabled>Select a wallet</SelectItem>
              <SelectItem value="evcplus">
                <FaMoneyBillWave className="inline-block mr-2 text-green-500" /> EVC PLUS
              </SelectItem>
            </Select>
          </div>
          <div className="text-center">
            <IoSwapHorizontal className="text-3xl text-gray-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">To</label>
            <Select id="to_wallet" name="to_wallet" required onChange={handleChange}>
              <SelectItem value="" disabled>Select a wallet</SelectItem>
              <SelectItem value="usdt">
                <FaDollarSign className="inline-block mr-2 text-blue-500" /> USDT
              </SelectItem>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Swap Address</label>
            <Input type="text" id="swap_address" name="swap_address" required onChange={handleChange} placeholder="Enter swap address" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
            <Input type="number" id="amount" name="amount" min="0" step="0.01" required onChange={handleChange} placeholder="0.00" />
          </div>
          {swapData.amount && (
            <CardContent className="mt-6 bg-gray-50 p-4 rounded-xl">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Swap Summary</h3>
              <div className="space-y-2 text-gray-600">
                <div className="flex justify-between border-b pb-2">
                  <span className="font-medium">From Wallet:</span>
                  <span className="font-semibold">{swapData.from_wallet}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="font-medium">To Wallet:</span>
                  <span className="font-semibold">{swapData.to_wallet.toUpperCase()}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="font-medium">Swap Address:</span>
                  <span>{swapData.swap_address}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="font-medium">Amount:</span>
                  <span>{swapData.amount}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="font-medium">Service Charge:</span>
                  <span>{swapRate * 100}%</span>
                </div>
                <div className="flex justify-between font-bold text-green-700">
                  <span>Total to Receive:</span>
                  <span>${swapData.amount - swapData.amount * swapRate}</span>
                </div>
              </div>
            </CardContent>
          )}
          <Button type="submit" className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl text-lg font-semibold shadow-md">
            Swap
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default Swap;
