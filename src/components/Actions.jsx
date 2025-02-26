"use client";

import React, { useState, useEffect } from "react";
import { ArrowDown, ArrowUp } from "lucide-react";
import { FaExchangeAlt } from "react-icons/fa";
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
import { Link, useNavigate } from "react-router-dom";

const Actions = () => {
  const [activeAction, setActiveAction] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => setIsVisible(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  const handlePaymentSelection = (method) => {
    setPaymentMethod(method);
    if (method === "evcplus") {
      navigate(`/${activeAction.toLowerCase()}/${method}`);
    } else {
      setIsVisible(true);
      setIsDrawerOpen(false);
    }
  };

  const paymentMethods = ["evcplus", "premier wallet", "golis", "USDT"];

  return (
    <div className="p-4">
      {isVisible && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 w-64 bg-white shadow-lg rounded-lg p-4 text-center z-50 animate-fade-in">
          <p className="text-sm font-medium text-gray-800">Coming Soon</p>
          <p className="text-xs text-gray-600 mt-1">New feature on its way!</p>
        </div>
      )}

      {/* Actions Section */}
      <section className="grid grid-cols-3 gap-6">
        {["Deposit", "Withdraw", "Swap"].map((action) => (
          <React.Fragment key={action}>
            {action === "Swap" ? (
              <Link to="/swap" className="flex flex-col items-center p-4 group">
                <div className="bg-yellow-100 p-3 rounded-full group-hover:bg-indigo-500 transition">
                  <FaExchangeAlt className="text-yellow-600" size={24} />
                </div>
                <span className="text-sm font-medium text-gray-900 mt-2">Swap</span>
              </Link>
            ) : (
              <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
                <DrawerTrigger asChild>
                  <button
                    className="flex flex-col items-center p-4 group"
                    onClick={() => {
                      setActiveAction(action);
                      setIsDrawerOpen(true);
                    }}
                  >
                    <div className={`p-3 rounded-full group-hover:bg-indigo-500 transition ${
                      action === "Deposit" ? "bg-blue-200" : "bg-red-200"
                    }`}>
                      {action === "Deposit" ? (
                        <ArrowDown className="text-blue-600" size={24} />
                      ) : (
                        <ArrowUp className="text-red-600" size={24} />
                      )}
                    </div>
                    <span className="text-sm font-medium text-gray-900 mt-2">{action}</span>
                  </button>
                </DrawerTrigger>

                <DrawerContent className="max-w-lg mx-auto rounded-t-3xl p-6">
                  <DrawerHeader>
                    <DrawerTitle className="text-lg font-semibold border-b pb-3">
                      {activeAction} Payment Methods
                    </DrawerTitle>
                    <DrawerClose />
                  </DrawerHeader>

                  <DrawerDescription className="py-4 space-y-4">
                    {paymentMethods.map((method) => (
                      <button
                        key={method}
                        className="flex items-center w-full p-3 rounded-lg border border-gray-300 hover:border-indigo-500 transition"
                        onClick={() => handlePaymentSelection(method)}
                      >
                        <img
                          className="w-10 h-10 rounded-full"
                          src={`/${method.replace(" ", "-").toLowerCase()}.png`}
                          alt={method}
                        />
                        <span className="ml-3 text-lg font-semibold capitalize">{method}</span>
                      </button>
                    ))}
                  </DrawerDescription>

                  <DrawerFooter className="border-t pt-4">
                    <DrawerClose asChild>
                      <button className="w-full bg-gray-600 text-white py-3 rounded-lg hover:bg-gray-700 transition">
                        Close
                      </button>
                    </DrawerClose>
                  </DrawerFooter>
                </DrawerContent>
              </Drawer>
            )}
          </React.Fragment>
        ))}
      </section>
    </div>
  );
};

export default Actions;
