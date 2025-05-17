import { z } from "zod";
import { dbConnect } from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { usernameValidation } from "@/schemas/signUpSchema";
import { NextRequest, NextResponse } from "next/server";

const UsernameQuerySchema = z.object({
  username: usernameValidation,
});

export const GET = async (request: NextRequest) => {
  await dbConnect();
  try {
    // get query params from url
    // eg. localhost:3000/username-available?username=xyz
    const { searchParams } = new URL(request.url);
    const queryParam = {
      username: searchParams.get("username"),
    };

    // validate with zod
    const result = UsernameQuerySchema.safeParse(queryParam);

    if (!result.success) {
      const usernameErrors = result.error.format().username?._errors || [];
      return NextResponse.json(
        {
          success: false,
          message:
            usernameErrors?.length > 0
              ? usernameErrors.join(", ")
              : "invalid query parameters",
        },
        { status: 400 }
      );
    }

    const { username } = result.data;

    const usernameAvailable = await UserModel.findOne({
      username,
      isVerified: true,
    });
    if (usernameAvailable) {
      return NextResponse.json(
        { success: false, message: "username already taken" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, message: "username is available" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error checking username: ", error);
    return NextResponse.json(
      { success: false, message: "Error checking username" },
      { status: 500 }
    );
  }
};
