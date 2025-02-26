import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Button } from "./ui/button";
import { Clock, Eye, EyeOff } from "lucide-react";

const Balance = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [balance, setBalance] = useState({ evcplus: 0 });
  const [loading, setLoading] = useState(true);
  const [pendingBalance, setPendingPayment] = useState({ total_pending_balance: 0 });

  const toggleVisibility = () => setIsVisible(!isVisible);

  const fetchBalance = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem("userData"));
      if (!userData?.access) return;
      
      const response = await fetch("https://api.goobjoogpay.com/api/balance/", {
        method: "GET",
        headers: { Authorization: `Bearer ${userData.access}` },
      });

      if (!response.ok) throw new Error("Failed to fetch balance");
      const data = await response.json();
      if (typeof data.evcplus !== "number") throw new Error("Invalid response format");
      setBalance(data);
    } catch (error) {
      console.error("Error fetching balance:", error);
      setBalance({ evcplus: 0 });
    } finally {
      setLoading(false);
    }
  };

  const fetchPendingPayments = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem("userData"));
      if (!userData?.access) return;
      
      const response = await fetch("https://api.goobjoogpay.com/api/pending-payments/", {
        method: "GET",
        headers: { Authorization: `Bearer ${userData.access}` },
      });

      if (!response.ok) throw new Error("Failed to fetch pending payments");
      const data = await response.json();
      if (typeof data.total_pending_balance !== "number") throw new Error("Invalid response format");
      setPendingPayment(data);
    } catch (error) {
      console.error("Error fetching pending payments:", error);
      setPendingPayment({ total_pending_balance: 0 });
    }
  };

  useEffect(() => {
    fetchBalance();
    fetchPendingPayments();
    const interval = setInterval(() => {
      fetchBalance();
      fetchPendingPayments();
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <Card className="w-full bg-gray-800 text-white animate-pulse rounded-xl shadow-xl">
        <CardContent className="p-6">
          <div className="h-6 bg-gray-600 rounded w-32 mb-4"></div>
          <div className="h-10 bg-gray-600 rounded w-48"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full bg-[#ffa702] text-white rounded-2xl shadow-xl p-6">
      <CardHeader className="flex items-center justify-between">
        <div className="flex items-center bg-white px-4 py-2 rounded-full text-[#ffa702] font-semibold shadow-md">
          <span className="text-lg">$</span>
          <span className="ml-2 text-sm">US Dollar</span>
        </div>
        <Button variant="ghost" size="icon" className="text-white" onClick={toggleVisibility}>
          {isVisible ? <Eye className="h-6 w-6" /> : <EyeOff className="h-6 w-6" />}
        </Button>
      </CardHeader>
      <CardContent className="space-y-6 text-center">
        <div>
          <p className="text-sm text-gray-200">Available Balance</p>
          <p className="text-5xl font-bold">
            {isVisible ? `$${balance.evcplus.toFixed(2)}` : "••••••"}
          </p>
        </div>
        <div className="flex items-center justify-between bg-white bg-opacity-20 p-4 rounded-xl shadow-md">
          <div className="flex items-center gap-2 text-white">
            <Clock className="h-5 w-5" />
            <span>Pending Money</span>
          </div>
          <span className="text-white font-medium text-lg">
            {isVisible ? `$${pendingBalance.total_pending_balance.toFixed(2)}` : "••••"}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default Balance;
