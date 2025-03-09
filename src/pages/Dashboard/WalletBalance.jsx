import { CircleDollarSign, Lock, Wallet, Copy } from "lucide-react";
import React, { useEffect, useState, useRef } from "react";
import { ArrowDown, ArrowUp, Bitcoin, University } from "lucide-react";
import {
  FaBitcoin,
  FaCcVisa,
  FaCreditCard,
  FaExchangeAlt,
  FaMobileAlt,
} from "react-icons/fa";
import Modal from "react-modal";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Clock, Eye, EyeOff, Plus } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const WalletBalance = () => {
  const [balance, setBalance] = useState({ evcplus: 0 }); // Default value
  const [loading, setLoading] = useState(true);
  const [activeAction, setActiveAction] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [showInstructions, setShowInstructions] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [pendingBalance, setPendingPayment] = useState({
    total_pending_balance: 0,
  }); // Default value
  const [depositData, setDepositData] = useState({
    wallet_name: "",
    amount: "",
    phone_number: "",
  });

  const [isVisible, setIsVisible] = useState(true);

  const toggleVisibility = () => setIsVisible(!isVisible);

  const [modalIsOpen, setModalIsOpen] = useState(false);

  const openModal = (action) => {
    setActiveAction(action);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  // Fetch balance from the API
  const fetchBalance = async () => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    const access = userData.access;
    try {
      const response = await fetch("/api/balance/", {
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
      "Error:", error;
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
      "Error:", error;
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

  // Skeleton loader component for Wallet Balance Card
  const renderWalletBalanceSkeleton = () => (
    <Card className="w-full bg-green-800 text-white">
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

  // Skeleton loader component for Actions Section
  const renderActionsSkeleton = () => (
    <section className="grid grid-cols-3 gap-4 mb-8">
      {[1, 2, 3].map((_, index) => (
        <div
          key={index}
          className="mt-4 p-4 flex flex-col items-center justify-center"
        >
          <div className="bg-gray-300 p-3 rounded-full mb-2 animate-pulse">
            <div className="w-6 h-6"></div>
          </div>
          <div className="bg-gray-300 w-16 h-4 rounded-md animate-pulse"></div>
        </div>
      ))}
    </section>
  );

  // Show skeleton loader while loading
  if (loading) {
    return (
      <div>
        {renderWalletBalanceSkeleton()}
        {renderActionsSkeleton()}
      </div>
    );
  }

  return (
    <div>
      <ToastContainer />
      {/* Wallet Balance Card */}
      <Card className="w-full bg-green-800 text-white">
        <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
          <div className="flex items-center gap-2 border px-4 py-1 bg-green-400 rounded-full border-green-400 text-black">
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
              {isVisible ? `$${balance?.evcplus.toFixed(2)}` : "••••••"}
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

      {/* Actions Section */}
    </div>
  );
};

export default WalletBalance;
