import { connectDB } from "@/lib/db";
import User from "@/models/User";

export async function POST(request) {
  try {
    const body = await request.json();

    const email = body.email?.toLowerCase().trim();
    const otp = body.otp?.trim();

    if (!email || !otp) {
      return Response.json(
        {
          success: false,
          message: "Email and OTP are required.",
        },
        { status: 400 },
      );
    }

    await connectDB();

    const user = await User.findOne({ email });

    if (!user) {
      return Response.json(
        {
          success: false,
          message: "User not found.",
        },
        { status: 404 },
      );
    }

    // Check OTP
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

    return Response.json(
      {
        success: true,
        message: "OTP verified successfully.",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Verify OTP Error:", error);

    return Response.json(
      {
        success: false,
        message: "Something went wrong.",
      },
      { status: 500 },
    );
  }
}
