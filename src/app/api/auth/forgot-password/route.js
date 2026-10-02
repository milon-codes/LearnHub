import { Resend } from "resend";
import crypto from "crypto";

import { connectDB } from "@/lib/db";
import User from "@/models/User";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request) {
  try {
    const body = await request.json();

    const email = body.email?.toLowerCase().trim();

    if (!email) {
      return Response.json(
        {
          success: false,
          message: "Email is required.",
        },
        { status: 400 },
      );
    }

    await connectDB();

    // Check user
    const user = await User.findOne({ email });

    if (!user) {
      return Response.json(
        {
          success: false,
          message: "No account found with this email.",
        },
        { status: 404 },
      );
    }

    // Generate 6 digit OTP
    const otp = crypto.randomInt(100000, 1000000).toString();

    console.log(otp);

    // OTP expires after 10 minutes
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    // Save OTP temporarily
    user.resetOtp = otp;
    user.resetOtpExpires = otpExpires;

    await user.save();

    // Send OTP email
    const { data, error } = await resend.emails.send({
      from: "LearnHub <onboarding@resend.dev>",
      to: [email],
      subject: "LearnHub Password Reset OTP",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto;">
          <h2>Reset Your LearnHub Password</h2>

          <p>
            We received a request to reset your LearnHub password.
          </p>

          <p>Your verification code is:</p>

          <div
            style="
              font-size: 32px;
              font-weight: bold;
              letter-spacing: 8px;
              padding: 20px;
              background: #f4f4f5;
              text-align: center;
              border-radius: 8px;
            "
          >
            ${otp}
          </div>

          <p>
            This OTP will expire in <strong>10 minutes</strong>.
          </p>

          <p>
            If you did not request a password reset, you can safely ignore this email.
          </p>

          <p>— LearnHub Team</p>
        </div>
      `,
    });

    if (error) {
      console.error("Resend Error:", error);

      return Response.json(
        {
          success: false,
          message: "Failed to send OTP.",
        },
        { status: 500 },
      );
    }

    return Response.json(
      {
        success: true,
        message: "OTP sent successfully to your email.",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Forgot Password Error:", error);

    return Response.json(
      {
        success: false,
        message: "Something went wrong.",
      },
      { status: 500 },
    );
  }
}
