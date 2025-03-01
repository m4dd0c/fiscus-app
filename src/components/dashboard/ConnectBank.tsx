"use client";
import { useState, useEffect } from "react";
import { usePlaidLink } from "react-plaid-link";
import axios from "axios";
import { useUser } from "@clerk/nextjs";
import Loader from "@/components/shared/Loader";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { useStore } from "@/hook/useStore";

const ConnectBank = () => {
  const [linkToken, setLinkToken] = useState<string | null>(null);
  const { user, isSignedIn, isLoaded } = useUser();
  const { fetchAccounts } = useStore();

  // generating temp link token
  useEffect(() => {
    const createLinkToken = async () => {
      if (!user) return;
      try {
        const response = await axios.post("/api/plaid/create-link-token", {
          client_user_id: user?.id, // Replace with actual user ID
        });
        setLinkToken(response.data.link_token);
      } catch (error) {
        toast("Error generating link token");
      }
    };
    if (isLoaded && isSignedIn) createLinkToken();
  }, [isLoaded, isSignedIn, user]);

  const [loading, setLoading] = useState(false);
  // generating access token
  const onSuccess = async (public_token: string) => {
    setLoading(true);
    try {
      await axios.post("/api/plaid/exchange-token", {
        public_token,
      });
      await fetchAccounts();
    } catch (error) {
      toast("Error exchanging public token.");
    } finally {
      setLoading(false);
    }
  };

  // using plaid fe lib to open plaid window
  const { open, ready } = usePlaidLink({
    token: linkToken!,
    onSuccess,
  });

  return !isLoaded ? (
    <Loader />
  ) : (
    <div>
      {
        <Button
          variant={"secondary"}
          onClick={() => open()}
          disabled={!ready || !linkToken}
        >
          {loading ? "Connecting..." : "Connect Bank"}
        </Button>
      }
    </div>
  );
};

export default ConnectBank;
