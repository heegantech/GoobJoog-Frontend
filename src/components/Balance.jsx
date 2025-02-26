import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Loader2 } from "lucide-react";

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

  return (
    <Card className="w-full max-w-md mx-auto bg-gradient-to-r from-blue-500 to-indigo-600 shadow-lg rounded-2xl p-6 border border-gray-200 text-white">
      <CardHeader className="flex items-center justify-between pb-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold">Account Balance</h2>
        <Button variant="ghost" size="icon" onClick={toggleVisibility}>
          {isVisible ? <Eye className="h-5 w-5 text-white" /> : <EyeOff className="h-5 w-5 text-white" />}
        </Button>
      </CardHeader>
      <CardContent className="space-y-6 text-center">
        {loading ? (
          <div className="flex justify-center items-center h-20">
            <Loader2 className="h-8 w-8 animate-spin text-gray-200" />
          </div>
        ) : (
          <>
            <div>
              <p className="text-sm">Available Balance</p>
              <p className="text-4xl font-bold">
                {isVisible ? `$${balance.evcplus.toFixed(2)}` : "••••••"}
              </p>
            </div>
            <div className="flex items-center justify-between bg-white bg-opacity-20 p-4 rounded-lg">
              <span className="text-sm">Pending Payments</span>
              <span className="text-lg font-medium">
                {isVisible ? `$${pendingBalance.total_pending_balance.toFixed(2)}` : "••••"}
              </span>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default Balance;
