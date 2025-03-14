"use client";

import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { Label } from "../ui/label";
import { toast } from "sonner";

const Notifier = () => {
  const [budget, setBudget] = useState(0);
  const [exceed, setExceed] = useState(0);
  const [loading, setLoading] = useState(false);

  const sendSMS = async () => {
    if (!budget || !exceed) {
      toast("Please provide a Budget and Exceed amount.");
      return;
    }

    setLoading(true);

    try {
      await axios.post("/api/send-sms", {
        budget,
        exceed,
      });

      toast("SMS send successfully.");
    } catch (error: any) {
      toast("Failed to send SMS");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="flex-1 mx-auto">
      <CardHeader>
        <CardTitle>Send SMS</CardTitle>
        <CardDescription>
          Send SMS to your number, giving info about budget and expenses.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Label htmlFor="">Budget Limit</Label>
        <Input
          type="number"
          placeholder="Budget"
          value={budget}
          onChange={(e) => setBudget(+e.target.value)}
        />
        <Label htmlFor="">Exceeded Amount</Label>
        <Input
          type="tel"
          placeholder="Exceeded Amount"
          value={exceed}
          onChange={(e) => setExceed(+e.target.value)}
        />
        <Button onClick={sendSMS} disabled={loading} className="w-full">
          {loading ? "Sending..." : "Send SMS"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default Notifier;
