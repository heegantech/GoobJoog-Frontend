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
      <Card className="w-full bg-gray-800 text-white animate-pulse">
        <CardContent className="p-6">
          <div className="h-6 bg-gray-600 rounded w-32 mb-4"></div>
          <div className="h-10 bg-gray-600 rounded w-48"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full bg-gradient-to-r from-indigo-600 to-indigo-800 text-white rounded-xl shadow-lg p-4">
      <CardHeader className="flex items-center justify-between">
        <div className="flex items-center bg-indigo-500 px-4 py-1 rounded-full">
          <span className="text-lg font-semibold">$</span>
          <span className="ml-2 text-sm">US Dollar</span>
        </div>
        <Button variant="ghost" size="icon" className="text-white" onClick={toggleVisibility}>
          {isVisible ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center">
          <p className="text-sm text-gray-200">Available Balance</p>
          <p className="text-4xl font-bold">
            {isVisible ? `$${balance.evcplus.toFixed(2)}` : "••••••"}
          </p>
        </div>
        <div className="flex items-center justify-between text-gray-300">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            <span>Pending Money</span>
          </div>
          <span className="text-white font-medium">
            {isVisible ? `$${pendingBalance.total_pending_balance.toFixed(2)}` : "••••"}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default Balance;
