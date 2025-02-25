import RecentTransactions from "@/components/RecentTransactions";
import WalletBalance from "./WalletBalance";
import Balance from "@/components/Balance";
import Actions from "@/components/Actions";

const Dashboard = () => {
  const userData = JSON.parse(localStorage.getItem("userData"));
  const access = userData?.access;

  if (!access) {
    navigate("/login");
    return;
  }

  return (
    <main className="px-4 pt-20 pb-24">
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
