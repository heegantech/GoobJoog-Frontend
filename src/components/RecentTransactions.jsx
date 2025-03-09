import React, { useEffect, useState } from "react";
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
import { Button } from "./ui/button";
import { RefreshCw } from "lucide-react";
import { BASE_URL } from "@/lib/base";

// Skeleton Loader Component
const SkeletonLoader = () => (
  <div className="animate-pulse space-y-4">
    <div className="flex items-center justify-between p-3 border border-green-100 rounded-xl">
      <div className="flex items-center space-x-3">
        <div className="w-20 h-12 bg-gray-300 rounded"></div>
        <div className="space-y-2">
          <div className="w-32 h-4 bg-gray-300 rounded"></div>
          <div className="w-24 h-4 bg-gray-300 rounded"></div>
        </div>
      </div>
      <div className="w-24 h-6 bg-gray-300 rounded"></div>
    </div>
  </div>
);

const RecentTransactions = () => {
  const [modalData, setModalData] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [swapRates, setSwapRates] = useState([]);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    setUser(userData);
  }, []);

  // const handleRecheck = () => {
  //   .log("Rechecking...");
  //   // Add your recheck logic here
  // };

  const fetchTransactions = async () => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    const access = userData?.access;
    // if (!access) {
    //   navigate(`/?redirectTo=${location.pathname}`);
    //   return;
    // }

    try {
      const response = await fetch(`${BASE_URL}/api/transactions/`, {
        headers: {
          Authorization: `Bearer ${access}`,
        },
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      setTransactions(data);
      setIsLoading(false); // Stop loading when data is fetched
    } catch (error) {
    
      setIsLoading(false); // Stop loading even if there's an error
    }
  };

  // const fetchSwapRates = async () => {
  //   try {
  //     const response = await fetch(`${BASE_URL}/api/swap-rates/`);
  //     const data = await response.json();
  //     setSwapRates(data);
  //   } catch (error) {
  //     ("Error fetching swap rates:", error);
  //   }
  // };

  useEffect(() => {
    // fetchSwapRates();
    fetchTransactions();
  }, []);

  return (
    <section className="mb-8 mt-5 ">
      <div className="flex justify-between">
        <h2 className="text-sm font-semibold text-gray-800">
          Recent Transactions
        </h2>
        <Link to="/transactions" className="text-sm font-semibold">
          View All
        </Link>
      </div>

      <div className="space-y-4">
        {isLoading ? (
          // Render skeleton loader when loading
          <>
            <SkeletonLoader />
            <SkeletonLoader />
            <SkeletonLoader />
            <SkeletonLoader />
          </>
        ) : (
          // Render actual transactions once loaded
          transactions.slice(0, 4).map((transaction) => (
            <Drawer key={transaction.id}>
              <DrawerTrigger className="w-full">
                <div
                  className="flex mt-5 items-center justify-between p-3 border border-primary-100 rounded-xl transition duration-300 cursor-pointer hover:bg-primary-50"
                  onClick={() => setModalData(transaction)}
                >
                  <div className="flex items-center space-x-3 ">
                    <img
                      src={
                        transaction.wallet === "evcplus"
                          ? "evc-plus.png"
                          : "/premier-wallet.png"
                      }
                      className="w-20 bg-primary-100 p-2 border rounded-xl"
                      alt="Transaction"
                    />

                    <div>
                      <p className="font-medium text-start text-green-800">
                        {transaction.type}
                      </p>
                      <p className="text-xs text-start text-gray-300">
                        {transaction.created_at.slice(0, 10)}
                      </p>
                    </div>
                  </div>
                  <span className={`${transaction.color} font-medium`}>
                    {transaction.type === "Payout" ? (
                      <span className="text-red-500">
                        -${Math.abs(transaction.amount).toFixed(2)}
                      </span>
                    ) : transaction.type === "Swap" ? (
                      <span className="text-yellow-500">
                        -${Math.abs(transaction.amount).toFixed(2)}
                      </span>
                    ) : (
                      <span className="text-green-500">
                        +${Math.abs(transaction.amount).toFixed(2)}
                      </span>
                    )}
                  </span>
                </div>
              </DrawerTrigger>

              <DrawerContent className="max-w-[600px] mx-auto rounded-t-3xl p-4">
                <DrawerHeader>
                  <DrawerTitle className="text-start text-xl border-b pb-4 pt-2">
                    Transaction Details
                  </DrawerTitle>
                  <DrawerClose />
                </DrawerHeader>
                <DrawerDescription className="p-4">
                  {modalData && (
                    <>
                      <div className="flex items-center justify-between mb-4">
                        <p className="text-black text-lg font-semibold ">
                          From Wallet
                        </p>
                        <p className="font-medium text-lg">
                          {modalData.phone_number}
                        </p>
                      </div>
                      <div className="flex items-center justify-between mb-4">
                        <p className="text-black text-lg font-semibold">Type</p>
                        <p className="font-medium text-lg ">{modalData.type}</p>
                      </div>
                      <div className="flex items-center justify-between mb-4">
                        <p className="text-black text-lg font-semibold">
                          Amount
                        </p>
                        <p className="font-medium text-lg">
                          ${modalData.amount}
                        </p>
                      </div>

                      <div className="flex items-center justify-between mb-4">
                        <p className="text-black text-lg font-semibold">Date</p>
                        <p className="font-medium text-lg ">
                          {new Date(modalData.created_at).toLocaleString()}
                        </p>
                      </div>

                      <div className="flex items-center justify-between mb-4">
                        <p className="text-black text-lg font-semibold">
                          Status
                        </p>
                        <p className="text-lg font-semibold">
                          {modalData.status === "Completed" ? (
                            <span className="bg-green-100 font-semibold text-green-800 px-2 py-1 rounded-full text-lg">
                              Completed
                            </span>
                          ) : modalData.status === "Rejected" ? (
                            <span className="bg-red-100 font-semibold text-red-800 px-2 py-1 rounded-full text-lg">
                              Rejected
                            </span>
                          ) : (
                            <span className="bg-red-100 font-semibold text-yellow-800 px-2 py-1 rounded-full text-lg">
                              Pending
                            </span>
                          )}
                        </p>
                      </div>
                      {/* {modalData.type === "Deposit" &&
                      modalData.status === "Pending" ? (
                        <Button
                          onClick={handleRecheck}
                          className="w-full rounded-full bg-red-500 border border-red-500 text-white  flex items-center space-x-2 px-4  text-sm sm:text-base my-2 py-5"
                        >
                          <RefreshCw className="h-4 w-4 sm:h-5 sm:w-5" />
                          <span>Recheck</span>
                        </Button>
                      ) : null} */}
                    </>
                  )}
                </DrawerDescription>
                <DrawerFooter className="border-t pt-4">
                  <DrawerClose>
                    <button className="w-full bg-gray-500 text-white py-2 rounded-lg hover:bg-primary-700 transition">
                      Close
                    </button>
                  </DrawerClose>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
          ))
        )}
      </div>
    </section>
  );
};

export default RecentTransactions;
