import RecentTransactions from "@/components/RecentTransactions";
import WalletBalance from "./WalletBalance";
import Balance from "@/components/Balance";
import Actions from "@/components/Actions";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  // const navigate = useNavigate();
  // const userData = JSON.parse(localStorage.getItem("userData"));
  // const access = userData?.access;

  // if (!access) {
  //   navigate("/login");
  //   return;
  // }

  return (
    <main className="max-w-md mx-auto w-full px-4 pt-20 pb-24">
      <Helmet>
        <title>Home</title>
      </Helmet>
      {/* Wallet Balance */}
      <Balance />

      {/* Actions */}

      <Actions />

      {/* Recent Transactions */}
      <RecentTransactions />

      {/* WhatsApp Floating Button */}
    </main>
  );
};

export default Dashboard;
