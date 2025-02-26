import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader } from "../../components/ui/card";
import {
  Edit2,
  Gift,
  HelpCircle,
  LogOut,
  Settings,
  Wallet,
  ChevronRight,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Helmet } from "react-helmet";

// Skeleton Loader Component
const SkeletonLoader = () => (
  <div className="animate-pulse space-y-4">
    <div className="h-24 w-24 bg-gray-300 rounded-full"></div>
    <div className="h-6 bg-gray-300 rounded w-1/3"></div>
    <div className="h-4 bg-gray-300 rounded w-2/3"></div>
    <div className="h-6 bg-gray-300 rounded w-1/2"></div>
  </div>
);

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch user details from the API
  const fetchUserDetails = async () => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    const access = userData?.access;
    if (!access) {
      navigate("/login");
      return;
    }

    try {
      const response = await fetch("https://api.barrowpay.com/auth/users/me/", {
        headers: {
          Authorization: `Bearer ${access}`,
        },
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      setUser(data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching user details:", error);
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("userData");
    navigate("/login");
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);

  return (
    <div className="min-h-screen mt-15 p-2">
      <Helmet>
        <title>Profile</title>
      </Helmet>
      <Card className=" w-full">
        <CardHeader className="text-center">
          {isLoading ? (
            <SkeletonLoader />
          ) : (
            <>
              <div className="relative mx-auto h-24 w-24">
                <Avatar className="w-full h-full">
                  <AvatarImage
                    src=""
                    alt="@shadcn"
                    className="w-full h-full rounded-full"
                  />
                  <AvatarFallback className="text-2xl">
                    {user?.full_name?.slice(0, 1).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <Button
                  size="icon"
                  variant="secondary"
                  className="absolute bottom-0 right-0 h-8 w-8 rounded-full shadow-lg"
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
              </div>
              <div className="mt-4 space-y-1">
                <h2 className="text-2xl font-semibold">{user?.full_name}</h2>
                <p className="text-xl text-muted-foreground">
                  {user?.phone_number}
                </p>
              </div>
            </>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          <MenuItem
            icon={<Wallet className="h-5 w-5" />}
            label="Request Statement"
          />
          <MenuItem icon={<Edit2 className="h-5 w-5" />} label="Edit Profile" />
          <MenuItem
            icon={<Gift className="h-5 w-5" />}
            label="Discount Voucher"
          />
          <MenuItem icon={<HelpCircle className="h-5 w-5" />} label="Support" />
          <hr />
          <MenuItem icon={<Settings className="h-5 w-5" />} label="Settings" />
          <MenuItem
            icon={<LogOut className="h-5 w-5" />}
            label="Log Out"
            className="text-red-500"
            onClick={handleLogout}
          />
          <hr />
        </CardContent>
      </Card>
    </div>
  );
}

function MenuItem({ icon, label, className = "", onClick }) {
  return (
    <button
      className={`flex w-full items-center justify-between rounded-lg p-3 hover:bg-gray-100 ${className}`}
      onClick={onClick}
    >
      <div className="flex items-center gap-3">
        {icon}
        <span className="font-medium">{label}</span>
      </div>
      <ChevronRight className="h-5 w-5 text-gray-400" />
    </button>
  );
}
