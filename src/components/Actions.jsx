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
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  const handleActionSubmit = (event) => {
    event.preventDefault();
    if (paymentMethod) {
      navigate(`/wallet_name/${paymentMethod}`);
    }
  };

  const PopUpAlert = () => (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 w-64 bg-white rounded-md shadow-lg p-4 text-center animate-pop-up z-50">
      <p className="text-sm font-medium text-gray-800">Coming Soon</p>
      <p className="text-xs text-gray-600 mt-1">New feature on its way!</p>
    </div>
  );

  const renderPaymentMethods = () => (
    <div>
      <div className="flex flex-col space-y-4 ">
        {["evcplus", "premier wallet", "golis", "USDT"].map((method) => (
          <button
            key={method}
            className="flex  hover:border-base-500 items-center text-black py-2 px-4 rounded-lg border-gray-400 border  transition duration-300"
            onClick={() => {
              setPaymentMethod(method);
              if (method === "evcplus") {
                navigate(`/${activeAction.toLowerCase()}/${method}`);
              } else {
                setIsVisible(true);
                setIsDrawerOpen(false);
              }
            }}
          >
            <div className="flex items-center space-x-2">
              <div className="p-2 rounded-full  flex items-center justify-center">
                <img
                  className="w-10 rounded-full "
                  src={
                    method === "evcplus"
                      ? "evc-plus.png"
                      : method === "golis"
                      ? "golis.png"
                      : method === "premier wallet"
                      ? "premier-walltet.png"
                      : method === "USDT"
                      ? "usdt.webp"
                      : method === "moneyGo"
                      ? "moneyGo.png"
                      : null
                  }
                  alt="Payment Method"
                />
              </div>
              <span className="pl-2 text-black text-xl font-semibold capitalize">
                {method}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div>
      {isVisible && <PopUpAlert />}
      {/* Actions Section */}
      <section className="grid grid-cols-3 gap-4 mb-8">
        {["Deposit", "Withdraw", "Swap"].map((action) => (
          <React.Fragment key={action}>
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
                  <button
                    className="mt-4 p-4 flex flex-col items-center justify-center group"
                    onClick={() => {
                      setActiveAction(action);
                      setIsDrawerOpen(true);
                    }}
                  >
                    <div
                      className={`p-3 rounded-full mb-2 group-hover:bg-[#7173d6] transition duration-300 ${
                        action === "Deposit"
                          ? "bg-base-300"
                          : action === "Withdraw"
                          ? "bg-red-200"
                          : ""
                      }`}
                    >
                      {action === "Deposit" && (
                        <ArrowDown className="text-blue-600" size={24} />
                      )}
                      {action === "Withdraw" && (
                        <ArrowUp className="text-red-600" size={24} />
                      )}
                    </div>
                    <span className="text-sm font-medium text-black">
                      {action}
                    </span>
                  </button>
                </DrawerTrigger>

                <DrawerContent className="max-w-[600px] mx-auto rounded-t-3xl p-4">
                  <DrawerHeader>
                    <DrawerTitle className="text-start text-xl border-b pb-4 pt-2">
                      {activeAction} Payment Methods
                    </DrawerTitle>
                    <DrawerClose />
                  </DrawerHeader>
                  <DrawerDescription className="p-4">
                    {/* Payment Methods for Deposit and Withdraw */}
                    {(activeAction === "Deposit" ||
                      activeAction === "Withdraw") &&
                      renderPaymentMethods()}
                  </DrawerDescription>
                  <DrawerFooter className="border-t pt-4">
                    <DrawerClose asChild>
                      <button className="w-full bg-gray-500 text-white py-4 rounded-lg hover:bg-gray-600 transition">
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
