import { dbConnect } from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { NextRequest, NextResponse } from "next/server";
import { verifySchema } from "@/schemas/verifySchema";

export const POST = async (request: NextRequest) => {
  await dbConnect();
  try {
    const { username, code } = await request.json();
    const decodedUsername = decodeURIComponent(username);

    const result = verifySchema.safeParse({ code });
    console.log("🚀 ~ POST ~ result:", result);

    if (!result.success) {
      const verifyCodeErrors = result.error.format().code?._errors || [];
      return NextResponse.json(
        {
          success: false,
          message:
            verifyCodeErrors?.length > 0
              ? verifyCodeErrors.join(", ")
              : "Invalid query parameters",
        },
        { status: 400 }
      );
    }

    const verifyCode = result.data.code;

    const user = await UserModel.findOne({ username: decodedUsername });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "user not found" },
        { status: 404 }
      );
    }

    const isCodeValid = user.verifyCode === verifyCode;
    const isCodeExpired = new Date(user.verifyCodeExpiry) < new Date();

    if (!isCodeValid) {
      return NextResponse.json(
        { success: false, message: "Invalid Verification code" },
        { status: 400 }
      );
    }
    if (isCodeExpired) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Verification code expired, please signup again to get a new code",
        },
        { status: 400 }
      );
    }
    user.isVerified = true;
    await user.save();
    return NextResponse.json(
      { success: true, message: "Account verified successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error verifying user: ", error);
    return NextResponse.json(
      { success: false, message: "Error verifying user" },
      { status: 500 }
    );
  }
};
