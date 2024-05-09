import UserModel from "@/model/User";
import dbConnect from "@/lib/dbConnect";
import { z } from "zod";
import { usernameValidation } from "@/schemas/signupSchema";

const UsernameQuerySchema = z.object({
  username: usernameValidation,
});

export async function GET(request: Request) {
  await dbConnect();
  try {
    const { searchParams } = new URL(request.url);
    const queryParams = {
      username: searchParams.get("username"),
    };
    console.log("queryParams : ", queryParams)
    // validate by zod
    const result = UsernameQuerySchema.safeParse(queryParams);
    console.log("username checking : ", result);

    if (!result.success) {
      const usernameError = result.error.format().username?._errors || [];

      return Response.json(
        {
          success: false,
          messsage: usernameError.length
            ? usernameError.join(", ")
            : "Invalid Username",
        },
        { status: 400 }
      );
    }
    const { username } = result.data;
    const existingUser = await UserModel.findOne({
      username,
      isVerified: true,
    });
    if (existingUser) {
      return Response.json(
        {
          success: false,
          messsage: "Username already exists",
        },
        { status: 400 }
      );
    }
    return Response.json(
      {
        success: true,
        messsage: "Username is available to use",
      },
      { status: 200 }
    );


  } catch (error) {
    console.log("error during username checking: ", error);
    return Response.json(
      {
        success: false,
        message: "error during username checking",
      },
      { status: 500 }
    );
  }
}
