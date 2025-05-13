import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import UserModel from "@/models/User";
import { authOptions } from "../../auth/[...nextauth]/options";

export const DELETE = async (
  request: NextRequest,
  { params }: { params: { messageId: string } }
) => {
  const messageId = params.messageId;
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

  try {
    const updatedMessage = await UserModel.updateOne(
      { _id: user._id },
      { $pull: { messages: { _id: messageId } } }
    );
    if (updatedMessage.modifiedCount === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Message not found or already deleted",
        },
        { status: 404 }
      );
    }
    return NextResponse.json(
      {
        success: true,
        message: "Message deleted successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting message: ", error);
    return NextResponse.json(
      { message: "Error deleting message", success: false },
      { status: 500 }
    );
  }
};
