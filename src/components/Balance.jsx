import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Button } from "./ui/button";
import { Clock, Eye, EyeOff } from "lucide-react";

const Balance = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [balance, setBalance] = useState({ evcplus: 0 }); // Default value
  const [loading, setLoading] = useState(true);
  const [pendingBalance, setPendingPayment] = useState({
    total_pending_balance: 0,
  }); // Default value
  const toggleVisibility = () => setIsVisible(!isVisible);

  const fetchBalance = async () => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    const access = userData.access;

    if (!access) {
      navigate("/login");
      return;
    }

    try {
      const response = await fetch("https://api.barrowpay.com/api/balance/", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${access}`,
        },
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setBalance(data);
      setLoading(false);
    } catch (error) {
      console.error("Error:", error);
      setLoading(false);
      setBalance({ evcplus: 0 }); // Set default value on error
    }
  };

  // Fetch pending payments from the API
  const pendingPayment = async () => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    const access = userData.access;
    try {
      const response = await fetch("/api/pending-payments/", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${access}`,
        },
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setPendingPayment(data);
      setLoading(false);
    } catch (error) {
      console.error("Error:", error);
      setLoading(false);
      setPendingPayment({ total_pending_balance: 0 }); // Set default value on error
    }
  };

  // Fetch balance and pending payments on component mount
  useEffect(() => {
    pendingPayment();
    fetchBalance();
    const balanceInterval = setInterval(fetchBalance, 60000); // Refresh balance every 1 minute
    const paymentInterval = setInterval(pendingPayment, 60000); // Refresh pending payments every 1 minute

    return () => {
      clearInterval(balanceInterval);
      clearInterval(paymentInterval);
    };
  }, []);

  const renderWalletBalanceSkeleton = () => (
    <Card className="w-full bg-[#292a86] text-white">
      <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center gap-2">
          <div className="bg-gray-300 w-20 h-4 rounded-md animate-pulse"></div>
        </div>
        <div className="bg-gray-300 w-6 h-6 rounded-full animate-pulse"></div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-1">
          <div className="bg-gray-300 w-24 h-4 rounded-md animate-pulse"></div>
          <div className="bg-gray-300 w-32 h-8 rounded-md animate-pulse"></div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-gray-300 w-6 h-6 rounded-full animate-pulse"></div>
            <div className="bg-gray-300 w-20 h-4 rounded-md animate-pulse"></div>
          </div>
          <div className="bg-gray-300 w-16 h-4 rounded-md animate-pulse"></div>
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return <div>{renderWalletBalanceSkeleton()}</div>;
  }
  return (
    <Card className="w-full bg-[#292a86] text-white">
      <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center gap-2 border px-4 py-1 bg-[#7b7ce6] rounded-full border-[#292a86] text-black">
          <span className="text-lg text-black uppercase">$</span>
          <span className="text-base font-medium">US Dollar</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:text-white"
          onClick={toggleVisibility}
        >
          {isVisible ? (
            <Eye className="h-5 w-5" />
          ) : (
            <EyeOff className="h-5 w-5" />
          )}
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-1">
          <p className="text-sm text-white">Available balance</p>
          <p className="text-4xl font-semibold tracking-tight">
            {isVisible ? `$${balance.Balance > 0 ? balance.evcplus || "0.00" : "0.00"}` : "••••••"}
          </p>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-white">
            <Clock className="h-5 w-5" />
            <span className="text-sm">Pending money</span>
          </div>
          <span className="text-sm font-medium">
            {isVisible ? `$${pendingBalance?.total_pending_balance}` : "••••"}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default Balance;
