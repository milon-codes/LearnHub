import { connectDB } from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(request) {
  try {
    const body = await request.json();

    // const email = body.email?.toLowerCase().trim();
    // const otp = body.otp?.trim();
    const newPassword = body.newPassword;
    const confirmPassword = body.confirmPassword;
    const { email, otp } = body;

    console.log(body, email, otp, newPassword, confirmPassword, "data");

    // Required fields
    if (!email || !otp || !newPassword || !confirmPassword) {
      return Response.json(
        {
          success: false,
          message: "All fields are required.",
        },
        { status: 400 },
      );
    }

    // Password match
    if (newPassword !== confirmPassword) {
      return Response.json(
        {
          success: false,
          message: "Passwords do not match.",
        },
        { status: 400 },
      );
    }

    // Basic password validation
    if (newPassword.length < 6) {
      return Response.json(
        {
          success: false,
          message: "Password must be at least 6 characters.",
        },
        { status: 400 },
      );
    }

    await connectDB();

    const user = await User.findOne({ email }).select(
      "+password +resetOtp +resetOtpExpires",
    );

    if (!user) {
      return Response.json(
        {
          success: false,
          message: "User not found.",
        },
        { status: 404 },
      );
    }

    // Verify OTP again
    if (!user.resetOtp || user.resetOtp !== otp) {
      return Response.json(
        {
          success: false,
          message: "Invalid OTP.",
        },
        { status: 400 },
      );
    }

    // Check OTP expiry
    if (!user.resetOtpExpires || user.resetOtpExpires < new Date()) {
      return Response.json(
        {
          success: false,
          message: "OTP has expired.",
        },
        { status: 400 },
      );
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // Update password
    user.password = hashedPassword;

    // Invalidate OTP
    user.resetOtp = "";
    user.resetOtpExpires = null;

    await user.save();

    return Response.json(
      {
        success: true,
        message: "Password reset successfully.",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Reset Password Error:", error);

    return Response.json(
      {
        success: false,
        message: "Something went wrong.",
      },
      { status: 500 },
    );
  }
}
