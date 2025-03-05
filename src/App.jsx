import { Link, Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Login from "./components/LoginForm";
import Profile from "./pages/Dashboard/Profile";
import TransactionList from "./pages/Dashboard/TransactionList";
import Dashboard from "./pages/Dashboard/Dashboard";
import Register from "./components/Register";
import PrivateRoutes from "./routes/protectedRoutes";
import { Toaster } from "react-hot-toast";
import { FaWhatsapp } from "react-icons/fa";
import Deposit from "./components/Deposit";
import Withdraw from "./components/Withdraw";
import Swap from "./components/Swap";

function App() {
  return (
    <div className="max-w-md mx-auto w-full">
      <Router>
        <Toaster />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="*"
            element={
              <div className="flex items-center justify-center h-screen">
                <h1 className="text-3xl text-gray-800">404 | Not Found</h1>
              </div>
            }
          />
          <Route path="/register" element={<Register />} />
          <Route element={<PrivateRoutes />}>
            <Route
              path="/"
              element={
                <>
                  <Header />
                  <Dashboard />
                  <Footer />
                  <Link
                    to="https://wa.me/yourphonenumber"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="fixed bottom-18 right-6 bg-green-500 text-white p-4 rounded-full shadow-lg flex items-center justify-center"
                  >
                    <FaWhatsapp className="w-8 h-8" />
                  </Link>
                </>
              }
            />

            <Route
              path="/profile"
              element={
                <div className="min-h-screen flex flex-col">
                  <Header />
                  <div className="flex-grow">
                    <Profile />
                  </div>
                  <Footer />
                  <Link
                    to="https://wa.me/yourphonenumber"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="fixed bottom-18 right-6 bg-green-500 text-white p-4 rounded-full shadow-lg flex items-center justify-center"
                  >
                    <FaWhatsapp className="w-8 h-8" />
                  </Link>
                </div>
              }
            />

            <Route
              path="/deposit/:method"
              element={
                <>
                  <Header />
                  <Deposit />
                  <Footer />
                  <Link
                    to="https://wa.me/yourphonenumber"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="fixed bottom-18 right-6 bg-green-500 text-white p-4 rounded-full shadow-lg flex items-center justify-center"
                  >
                    <FaWhatsapp className="w-8 h-8" />
                  </Link>
                </>
              }
            />
            <Route
              path="/withdraw/:method"
              element={
                <>
                  <Header />
                  <Withdraw />
                  <Footer />
                  <Link
                    to="https://wa.me/yourphonenumber"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="fixed bottom-18 right-6 bg-green-500 text-white p-4 rounded-full shadow-lg flex items-center justify-center"
                  >
                    <FaWhatsapp className="w-8 h-8" />
                  </Link>
                </>
              }
            />
            <Route
              path="/swap"
              element={
                <>
                  <Header />
                  <Swap />
                  <Footer />
                  <Link
                    to="https://wa.me/yourphonenumber"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="fixed bottom-18 right-6 bg-green-500 text-white p-4 rounded-full shadow-lg flex items-center justify-center"
                  >
                    <FaWhatsapp className="w-8 h-8" />
                  </Link>
                </>
              }
            />

            <Route
              path="/transactions"
              element={
                <>
                  <Header />
                  <TransactionList />
                  <Footer />
                  <Link
                    to="https://wa.me/yourphonenumber"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="fixed bottom-18 right-6 bg-green-500 text-white p-4 rounded-full shadow-lg flex items-center justify-center"
                  >
                    <FaWhatsapp className="w-8 h-8" />
                  </Link>
                </>
              }
            />
          </Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
