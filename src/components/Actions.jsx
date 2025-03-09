import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowDown, ArrowUp, RefreshCw, Check } from "lucide-react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { FaExchangeAlt } from "react-icons/fa";

const Actions = () => {
  const [activeAction, setActiveAction] = useState(null);
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [wallets, setWallets] = useState([]);

  const fetchWallets = async () => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    const access = userData?.access;
    try {
      const response = await fetch("/api/wallets/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access}`,
        },
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      setWallets(data);
    } catch (error) {
      console.error("Error fetching wallets:", error);
    }
  };

  useEffect(() => {
    fetchWallets();
  }, []);

  const navigate = useNavigate();

  const handleMethodSelect = (wallet) => {
    setSelectedMethod(wallet.id);

    // Directly navigate based on selected wallet and active action
    if (activeAction) {
      navigate(`/${activeAction.toLowerCase()}/${wallet.wallet_name}`);
      setIsDrawerOpen(false); // Close the drawer after selection
    }
  };

  const handleActionClick = (action) => {
    if (action === "Swap") {
      navigate("/swap");
    } else {
      setActiveAction(action);
      setIsDrawerOpen(true); // Open the drawer for Deposit/Withdraw
    }
  };

  return (
    <div className="relative">
      <section className="grid grid-cols-3 gap-4 max-w-md mx-auto">
        {["Deposit", "Withdraw", "Swap"].map((action) => (
          <div key={action} onClick={() => handleActionClick(action)}>
            {action === "Swap" ? (
              <Link
                to="/swap"
                className="mt-4 p-4 flex flex-col items-center justify-center group"
              >
                <div className="bg-yellow-100 p-3 rounded-full mb-2 group-hover:bg-[#7173d6] transition duration-300">
                  <FaExchangeAlt className="text-yellow-600" size={24} />
                </div>
                <span className="text-sm font-medium text-black">Swap</span>
              </Link>
            ) : (
              <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
                <DrawerTrigger asChild>
                  <button className="mt-4 p-4 flex flex-col items-center justify-center group">
                    <div
                      className={`p-3 rounded-full mb-2 group-hover:bg-[#7173d6] transition duration-300 ${
                        action === "Deposit" ? "bg-base-300" : "bg-red-200"
                      }`}
                    >
                      {action === "Deposit" ? (
                        <ArrowDown className="text-blue-600" size={24} />
                      ) : (
                        <ArrowUp className="text-red-600" size={24} />
                      )}
                    </div>
                    <span className="text-sm font-medium text-black">
                      {action}
                    </span>
                  </button>
                </DrawerTrigger>
                <DrawerContent className="max-w-md mx-auto rounded-t-3xl">
                  <DrawerHeader>
                    <DrawerTitle>{activeAction} Payment Methods</DrawerTitle>
                    <DrawerDescription>
                      Select a payment method to {activeAction?.toLowerCase()}
                    </DrawerDescription>
                  </DrawerHeader>
                  <div className="p-6 grid gap-4">
                    {wallets.map((wallet) => (
                      <div
                        key={wallet.id}
                        className="w-full flex items-center justify-between py-1 px-4 border rounded-xl"
                        onClick={() => handleMethodSelect(wallet)}
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={wallet.wallet_image}
                            alt={wallet.wallet_name}
                            className="w-10 h-10 object-contain rounded-full"
                          />
                          <span className="font-semibold capitalize">
                            {wallet.wallet_name === "usdt"
                              ? "USDT"
                              : wallet.wallet_name}
                          </span>
                        </div>
                        {selectedMethod === wallet.id && (
                          <Check className="h-4 w-4 text-blue-500" />
                        )}
                      </div>
                    ))}
                  </div>
                  <DrawerFooter>
                    <DrawerClose asChild>
                      <Button variant="outline" className="py-4 bg-gray-300">
                        Close
                      </Button>
                    </DrawerClose>
                  </DrawerFooter>
                </DrawerContent>
              </Drawer>
            )}
          </div>
        ))}
      </section>

      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <DrawerContent className="max-w-md mx-auto rounded-t-3xl">
          <DrawerHeader>
            <DrawerTitle>{activeAction} Payment Methods</DrawerTitle>
            <DrawerDescription>
              Select a payment method to {activeAction?.toLowerCase()}
            </DrawerDescription>
          </DrawerHeader>
          <div className="p-6 grid gap-4">
            {wallets.map((wallet) => (
              <div
                key={wallet.id}
                className={cn(
                  "w-full flex items-center justify-between py-1 px-4 border rounded-xl cursor-pointer",
                  selectedMethod === wallet.id && "border-blue-500"
                )}
                onClick={() => handleMethodSelect(wallet)}
              >
                <div className="flex items-center gap-3">
                  <img
                    src={wallet.wallet_image}
                    alt={wallet.wallet_name}
                    className="w-10 h-10 object-contain rounded-full"
                  />
                  <span className="font-semibold capitalize">
                    {wallet.wallet_name === "usdt"
                      ? "USDT"
                      : wallet.wallet_name}
                  </span>
                </div>
                {selectedMethod === wallet.id && (
                  <Check className="h-4 w-4 text-blue-500" />
                )}
              </div>
            ))}
          </div>
          <DrawerFooter>
            <DrawerClose asChild>
              <Button variant="outline" className="py-4 bg-gray-300">
                Close
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default Actions;
