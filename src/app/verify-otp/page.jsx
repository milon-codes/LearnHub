"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiArrowLeft, FiShield } from "react-icons/fi";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function VerifyOtpPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const storedEmail = sessionStorage.getItem("resetEmail");

    if (!storedEmail) {
      router.replace("/forgot-password");
      return;
    }

    setEmail(storedEmail);
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!otp) {
      setError("Please enter the OTP.");
      return;
    }

    if (otp.length !== 6) {
      setError("OTP must be 6 digits.");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          otp,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.message || "Invalid OTP.");
        return;
      }

      // Store OTP temporarily for password reset
      sessionStorage.setItem("resetOtp", otp);

      router.push("/reset-password");
    } catch (error) {
      console.error("Verify OTP Error:", error);

      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-[calc(100vh-5rem)] items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <FiShield className="text-xl text-primary" />
          </div>

          <CardTitle className="text-2xl">Verify OTP</CardTitle>

          <CardDescription>
            Enter the 6-digit code sent to your email.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="otp">Verification Code</Label>

              <Input
                id="otp"
                type="text"
                inputMode="numeric"
                maxLength={6}
                placeholder="123456"
                value={otp}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "").slice(0, 6);

                  setOtp(value);
                }}
                disabled={loading}
                className="text-center text-xl tracking-[0.5em]"
              />
            </div>

            {email && (
              <p className="text-center text-sm text-muted-foreground">
                OTP sent to{" "}
                <span className="font-medium text-foreground">{email}</span>
              </p>
            )}

            {error && (
              <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {error}
              </p>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Verifying..." : "Verify OTP"}
            </Button>

            <div className="text-center">
              <Link
                href="/forgot-password"
                className="inline-flex items-center text-sm text-muted-foreground transition-colors hover:text-primary"
              >
                <FiArrowLeft className="mr-2" />
                Change Email
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
