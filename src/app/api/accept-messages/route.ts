import { dbConnect } from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/options";
import UserModel from "@/models/User";

export const POST = async (request: NextRequest) => {
  await dbConnect();

  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json(
      {
        success: false,
        message: "Not Authenticated",
      },
      { status: 401 }
    );
  }
  const user = session?.user;

  const userId = user._id;
  const { acceptMessages } = await request.json();
  try {
    const updatedUser = await UserModel.findByIdAndUpdate(userId, {
      isAcceptingMessages: acceptMessages,
      new: true,
    });
    if (!updatedUser) {
      return NextResponse.json(
        {
          success: false,
          message: "Unable to find user to update message acceptance status",
        },
        { status: 404 }
      );
    }
    return NextResponse.json(
      {
        success: true,
        message: "Message Acceptance status updated successfully",
        updatedUser,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating message acceptance status:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error updating message acceptance status",
      },
      { status: 500 }
    );
  }
};

export const GET = async () => {
  await dbConnect();

  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json(
      {
        success: false,
        message: "Not Authenticated",
      },
      { status: 401 }
    );
  }
  const user = session?.user;
  const userId = user._id;
  try {
    const foundUser = await UserModel.findById(userId);
    if (!foundUser) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }
    return NextResponse.json(
      {
        success: true,
        isAcceptingMessages: foundUser.isAcceptingMessages,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error getting message acceptance status:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error getting message acceptance status",
      },
      { status: 500 }
    );
  }
};
