import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
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
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowDownToLine, ArrowUpFromLine, RefreshCw } from "lucide-react";
import { Helmet } from "react-helmet";
import QRCode from "react-qr-code";

const TransactionList = () => {
  const [modalData, setModalData] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  console.log(transactions);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchTransactions = async () => {
      const userData = JSON.parse(localStorage.getItem("userData"));
      const access = userData?.access;
      if (!access) {
        navigate("/login");
        return;
      }
      try {
        const response = await fetch("https://api.goobjoogpay.com/api/transactions/", {
          headers: { Authorization: `Bearer ${access}` },
        });
        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();
        setTransactions(data);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, [navigate]);

  const filteredTransactions = transactions.filter(
    (transaction) => filter === "all" || transaction.type.toLowerCase() === filter.toLowerCase()
  );

  return (
    <div className="bg-white text-primary-950">
      <Helmet>
        <title>Transactions</title>
      </Helmet>
      <Header />

      <main className="px-4 pt-20 pb-24">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold mb-4 text-black">Transaction History</h1>
          <div className="flex flex-wrap gap-2">
            {["all", "deposit", "Payout", "swap"].map((type) => (
              <Button
                key={type}
                variant={filter === type ? "default" : "outline"}
                onClick={() => setFilter(type)}
                className="capitalize"
              >
                {type}
              </Button>
            ))}
          </div>
        </div>
        <section className="mb-8">
          <div className="space-y-4">
            <Drawer>
              {loading ? (
                <p>Loading...</p>
              ) : filteredTransactions.length === 0 ? (
                <p>No transactions available</p>
              ) : (
                filteredTransactions.map((transaction) => (
                  <DrawerTrigger key={transaction.transaction_id} className="block">
                    <div
                      className="flex items-center justify-between p-3 border border-primary-100 rounded-xl transition duration-300 cursor-pointer hover:bg-primary-50"
                      onClick={() => setModalData(transaction)}
                    >
                      <div>
                        <p className="font-medium text-primary-800">{transaction.type}</p>
                        <p className="text-xs text-gray-500">{new Date(transaction.created_at).toLocaleDateString()}</p>
                      </div>
                      <p className={
                        transaction.type === "Payout" ? "text-red-500" : "text-green-500"
                      }>
                        {transaction.type === "Payout" ? "-" : "+"}${transaction.amount.toFixed(2)}
                      </p>
                    </div>
                  </DrawerTrigger>
                ))
              )}
              <DrawerContent className="max-w-lg mx-auto p-6 rounded-t-lg bg-white">
                <DrawerHeader>
                  <DrawerTitle>Transaction Details</DrawerTitle>
                  <DrawerClose />
                </DrawerHeader>
                <DrawerDescription>
                  {modalData && (
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <p className="font-semibold">From:</p>
                        <p>{modalData.phone_number}</p>
                      </div>
                      <div className="flex justify-between">
                        <p className="font-semibold">Type:</p>
                        <p>{modalData.transaction_type}</p>
                      </div>
                      <div className="flex justify-between">
                        <p className="font-semibold">Amount:</p>
                        <p>${modalData.amount}</p>
                      </div>
                      <div className="flex justify-between">
                        <p className="font-semibold">Date:</p>
                        <p>{new Date(modalData.created_at).toLocaleString()}</p>
                      </div>
                      <div className="flex justify-between">
                        <p className="font-semibold">Status:</p>
                        <p className={
                          modalData.status === "Completed" ? "text-green-600" : "text-yellow-500"
                        }>
                          {modalData.status}
                        </p>
                      </div>
                      <div className="flex justify-center">
                        <QRCode value={JSON.stringify(modalData)} size={128} />
                      </div>
                    </div>
                  )}
                </DrawerDescription>
                <DrawerFooter>
                  <DrawerClose>
                    <Button variant="outline" className="w-full">Close</Button>
                  </DrawerClose>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default TransactionList;
