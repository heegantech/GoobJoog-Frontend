import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const Deposit = ({ closeModal, fetchBalance, pendingPayment }) => {
    const { method } = useParams();
    const [paymentMethod, setPaymentMethod] = useState("");
    const [showInstructions, setShowInstructions] = useState(false);
    const [copySuccess, setCopySuccess] = useState(false);

    const [depositData, setDepositData] = useState({
        wallet_name: method || "",
        amount: "",
        phone_number: "", // Initialize as empty string
    });

    const [logedUser, setLogedUser] = useState(null);

    const handlePaymentMethodChange = (event) => {
        const selectedMethod = event.target.value;
        setPaymentMethod(selectedMethod);
        setShowInstructions(true); // Show instructions when a method is selected
        setDepositData((prevData) => ({
            ...prevData,
            wallet_name: selectedMethod,
        }));
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === 'phone_number') {
            // Remove any non-digit characters
            const formattedValue = value.replace(/\D/g, '');
            // Ensure the number starts with 6 and is no longer than 9 digits
            const validValue = formattedValue.startsWith('6') ? formattedValue.slice(0, 9) : '6' + formattedValue.slice(0, 8);
            setDepositData((prevData) => ({
                ...prevData,
                [name]: validValue,
            }));
        } else {
            setDepositData((prevData) => ({
                ...prevData,
                [name]: value,
            }));
        }
    };

    const handleCopyUSSD = () => {
        const ussdCode = `*712*${depositData.phone_number}*${depositData.amount}#`;
        navigator.clipboard.writeText(ussdCode).then(() => {
            setCopySuccess(true);
            setTimeout(() => {
                setCopySuccess(false);
            }, 2000);
        });
    };

    const navigate = useNavigate();
    const handleDeposit = async (e) => {
        e.preventDefault();
        const userData = JSON.parse(localStorage.getItem("userData"));
        const access = userData.access;

        if (!access) {
            navigate("/login");
            return;
        }

        if (depositData.amount < 0) {
            toast.error("Amount cannot be negative");
            return;
        }

        try {
            const response = await fetch("https://api.barrowpay.com/api/deposit/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${access}`,
                },
                body: JSON.stringify(depositData),
            });

            const responseData = await response.json();

            if (response.ok) {
                toast.success(responseData.message);
                setDepositData({
                    wallet_name: "",
                    amount: "",
                    phone_number: "",
                });
                // Show the instructions and delay the redirection
                setTimeout(() => {
                    window.location.href = `tel:*712*${depositData.phone_number}*${depositData.amount}#`;
                }, 3000); // Delay redirection for 3 seconds (you can adjust this delay)
            } else {
                throw new Error(responseData.message || "Deposit failed");
            }
        } catch (error) {
            toast.error(error.message);
            console.error("Error:", error);
        }
    };

    const userMe = async () => {
        const userData = JSON.parse(localStorage.getItem("userData"));
        const access = userData.access;
        try {
            const response = await fetch("/auth/users/me/", {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${access}`,
                },
            });

            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            const data = await response.json();
            console.log(data);
            setLogedUser(data);
            
            // Set the phone number from user data
            if (data.phone_number) {
                setDepositData(prevData => ({
                    ...prevData,
                    phone_number: data.phone_number.replace('+252', '') // Remove the country code if present
                }));
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    useEffect(() => {
        userMe();
    }, []);

    if (method !== "evcplus") {
        return (
            <div className="mt-20 px-5">
                <h2 className="text-xl font-semibold text-primary-700">Coming Soon</h2>
            </div>
        );
    }

    return (
        <div className="mt-20 px-5">
            <form onSubmit={handleDeposit}>
                <div className="mb-4">
                    <label
                        htmlFor="amount"
                        className="block text-sm font-medium text-primary-700 mb-1"
                    >
                        Amount
                    </label>
                    <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-primary-500">
                            $
                        </span>
                        <input
                            type="number"
                            id="amount"
                            name="amount"
                            value={depositData.amount}
                            onChange={handleInputChange}
                            required
                            className="block w-full pl-7 pr-12 py-2 border border-green-500 rounded-md focus:ring-primary-500 focus:border-primary-500"
                            placeholder="0.00"
                        />
                    </div>
                </div>
                <div className="mb-4">
                    <label
                        htmlFor="phone_number"
                        className="block text-sm font-medium text-primary-700 mb-1"
                    >
                        Phone Number
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-4">
                            <div className="flex items-center gap-2 pr-3 border-r">
                                <img
                                    src="https://flagcdn.com/w40/so.png"
                                    width={22}
                                    height={16}
                                    alt="Somalia flag"
                                    className="rounded-sm"
                                />
                                <span className="text-sm font-medium">+252</span>
                            </div>
                        </div>
                        <input
                            type="tel"
                            id="phone_number"
                            name="phone_number"
                            value={depositData.phone_number}
                            required
                            pattern="^6[1-9][0-9]{7}$"
                            maxLength="9"
                            className="block w-full pl-24 pr-12 py-2 border border-green-500 rounded-md focus:ring-primary-500 focus:border-primary-500"
                            placeholder="615XXXXXX"
                            onChange={handleInputChange}
                            onInvalid={(e) => e.target.setCustomValidity('Please enter a valid 9-digit phone number starting with 6')}
                            onInput={(e) => e.target.setCustomValidity('')}
                        />
                    </div>
                    {depositData.phone_number && depositData.phone_number.length !== 9 && (
                        <p className="text-red-500 text-xs mt-1">Phone number must be exactly 9 digits long</p>
                    )}
                </div>
                <button
                    type="submit"
                    className="w-full bg-primary-600 text-white font-semibold py-3 px-4 rounded-xl hover:bg-primary-700 transition duration-300"
                >
                    Deposit
                </button>
            </form>

            {showInstructions && (
                <div className="mt-6 bg-primary-50 border border-primary-200 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-primary-800 mb-2">
                        To finish deposit, please follow the payment instructions:
                    </h3>
                    <div className="flex items-center justify-between bg-white p-3 rounded-md">
                        <span className="text-primary-700 font-medium">
                            *712*{depositData.phone_number}*{depositData.amount}#
                        </span>
                        <button
                            onClick={handleCopyUSSD}
                            className="text-primary-600 hover:text-primary-800"
                        >
                            <i className="far fa-copy"></i>
                        </button>
                    </div>
                    {copySuccess && (
                        <p className="text-green-600 mt-2">Copied to clipboard!</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default Deposit;
