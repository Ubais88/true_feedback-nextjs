import { User } from "next-auth";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

export async function POST(request: Request) {
  dbConnect();

  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;

  if (!session || !session.user) {
    return Response.json(
      {
        success: false,
        message: "Not Authenticated",
      },
      { status: 401 }
    );
  }
  const userId = user._id;
  await request.json();
  const { acceptMessages } = await request.json();
  try {
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      {
        isAcceptingMessage: acceptMessages,
      },
      { new: true }
    );

    if(!updatedUser){
        return Response.json(
            {
              success: false,
              message: "User not found",
            },
            { status: 401 }
          );
    }

    return Response.json(
        {
          success: true,
          message: "Accept message status updated successfully",
        },
        { status: 401 }
      );

  } catch (error) {
    console.log(error);
    return Response.json(
      {
        success: false,
        message: "Failed to update accept message status",
      },
      { status: 500 }
    );
  }
}




