import React, { useState } from "react";
import { ArrowDown, ArrowUp, Bitcoin } from "lucide-react";
import { FaCcVisa, FaExchangeAlt, FaMobileAlt } from "react-icons/fa";

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

  if (!paymentMethod === "evcplus") {
    return <div>Payment method not found</div>;
  }

  const navigate = useNavigate();

  // Handle form submission and redirect to wallet_name route
  const handleActionSubmit = (event) => {
    event.preventDefault();
    if (paymentMethod) {
      navigate(`/wallet_name/${paymentMethod}`);
    }
  };

  const renderPaymentMethods = () => (
    <div>
      <div className="flex flex-col space-y-4">
        {["evcplus", "premier wallet", "golis", "USDT"].map((method) => (
          <button
            key={method}
            className="flex items-center text-black py-2 px-4 rounded-lg border-gray-400 border hover:bg-blue-600 transition duration-300"
            onClick={() => {
              setPaymentMethod(method);
              navigate(
                method === "evcplus"
                  ? `/${activeAction.toLowerCase()}/${method}`
                  : alert("Coming Soon")
              );
            }}
          >
            <div className="flex items-center space-x-2">
              <div className="p-2 rounded-full flex items-center justify-center">
                <img
                  className="w-10 rounded-full"
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
      {/* Actions Section */}
      <section className="grid grid-cols-3 gap-4 mb-8">
        {["Deposit", "Withdraw", "Swap"].map((action) => (
          <React.Fragment key={action}>
            {action === "Swap" ? (
              <Link
                to="/swap"
                className="mt-4 p-4 flex flex-col items-center justify-center group"
              >
                <div className="bg-[#a8aae9] p-3 rounded-full mb-2 group-hover:bg-[#7173d6] transition duration-300">
                  <FaExchangeAlt className="text-yellow-300" size={24} />
                </div>
                <span className="text-sm font-medium text-green-800">Swap</span>
              </Link>
            ) : (
              <Drawer>
                <DrawerTrigger asChild>
                  <button
                    className="mt-4 p-4 flex flex-col items-center justify-center group"
                    onClick={() => setActiveAction(action)}
                  >
                    <div className="bg-[#a8aae9] p-3 rounded-full mb-2 group-hover:bg-[#7173d6] transition duration-300">
                      {action === "Deposit" && (
                        <ArrowDown className="text-blue-600" size={24} />
                      )}
                      {action === "Withdraw" && (
                        <ArrowUp className="text-red-600" size={24} />
                      )}
                    </div>
                    <span className="text-sm font-medium text-green-800">
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
