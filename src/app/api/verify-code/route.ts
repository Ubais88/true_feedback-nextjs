import UserModel from "@/model/User";
import dbConnect from "@/lib/dbConnect"; 

export async function POST(request:Request){
    await dbConnect();
    try {
        const { username , code } = await request.json();
        console.log("normal username: " , username)
        const decodedUsername = decodeURIComponent(username)
        console.log("decodedUsername: ", decodedUsername)
        const user = await UserModel.findOne({ username : decodedUsername});
        if(!user){
            return Response.json({
                success:false,
                message:"User not found"
            }, {status:400})
        }
        const isCodeValid = user.verifyCode === code ;
        const isCodeNotExpiry = new Date(user.verifyCodeExpiry) > new Date() ;
        if(isCodeValid && isCodeNotExpiry){
            user.isVerified = true;
            await user.save();

            return Response.json({
                success:true,
                message:"User is now verified"
            }, {status:200})
        }
        else if(!isCodeNotExpiry){
            return Response.json({
                success:false,
                message:"code is expired"
            }, {status:400})
        }
        else{
            return Response.json({
                success:false,
                message:"code is invalid"
            }, {status:400})
        }

        
    } catch (error) {
        console.log("error during code verification: ", error)
        return Response.json({
            success:false,
            message:"Error during code verification"
        }, {status:400})
    }
}