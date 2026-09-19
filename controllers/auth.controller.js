import UserModel from "../models/user.model.js";
import otpgenerator from "otp-generator";
import OtpModel from "../models/otp.model.js";
import { hashingPassword } from "../utils/hashingPassword.js";
import bcryptjs from "bcryptjs";
import { generateToken } from "../utils/generateToken.js";

//save otp in db and used pre method in OtpModel to send mail before saving data in db
export const otpSave = async (req, res) => {
  try {
    // fetch email
    const { email, userName } = req.body;

    if (!email || !userName) {
      return res.status(400).json({
        error: true,
        success: false,
        message: "Something went wrong during fetching details",
      });
    }
    // find user is already registered
    const userExists = await UserModel.findOne({ email: email });

    if (userExists) {
      return res.status(400).json({
        error: true,
        success: false,
        message: "User is already registered",
      });
    }

    //find weather username already exists or not
    const userNameExists = await UserModel.findOne({ userName: userName });

    if (userNameExists) {
      return res.status(400).json({
        error: true,
        success: false,
        message: "Username already exists",
      });
    }

    const otp = otpgenerator.generate(4, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    //create entry in Db
    const newOtp = await OtpModel.create({ email: email, otp: otp });

    return res.status(200).json({
      error: false,
      success: true,
      message: "Otp sent successfully",
      otp: newOtp,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

export const signUp = async (req, res) => {
  try {
    const { userName, email, password, otp } = req.body;

    //validation
    if (!userName || !email || !password || !otp) {
      return res.status(400).json({
        error: true,
        success: false,
        message: "All fields are required",
      });
    }

    // Parallel validation: check if user already exists and get latest otp concurrently
    const [existedUser, latestOtp] = await Promise.all([
      UserModel.findOne({ email: email }),
      OtpModel.findOne({ email: email }).sort({ createdAt: -1 }),
    ]);

    if (existedUser) {
      return res.status(400).json({
        error: true,
        success: false,
        message: "Email already registered",
      });
    }

    if (!latestOtp) {
      return res.status(400).json({
        error: true,
        success: false,
        message: "OTP not found",
      });
    }

    if (latestOtp.otp !== Number(otp)) {
      return res.status(400).json({
        error: true,
        success: false,
        message: "OTP not matched",
      });
    }

    const hashedPassword = await hashingPassword(password);

    //generate radnom avatar
    const avatar = `https://api.dicebear.com/10.x/adventurer/svg?seed=${userName}`;

    const user = await UserModel.create({
      userName,
      email,
      password: hashedPassword,
      profilePicture: avatar,
    });
    const u = user.toObject();
    delete u.password;

    return res.status(200).json({
      error: false,
      success: true,
      message: "User created successfully",
      user: u,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    //validation
    if (!email || !password) {
      return res.status(400).json({
        error: true,
        success: false,
        message: "All fields are required",
      });
    }

    //check user account is created or not
    const user = await UserModel.findOne({ email: email }).select("+password");

    if (!user) {
      return res.status(400).json({
        error: true,
        success: false,
        message: "Email is not registered",
      });
    }
    const checkPassword = await bcryptjs.compare(password, user.password);
    if (!checkPassword) {
      return res.status(400).json({
        message: "Check your username & password",
        error: true,
        success: false,
      });
    }

    //payload for jwt
    const payload = {
      userId: user._id,
      userName: user.userName,
      email: user.email,
    };
    const token = await generateToken(payload);

    const cookiesOptions = {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    };

    res.cookie("token", token, cookiesOptions);

    // while sending token or data you can also use this but always convert toObject() before setting data
    const u = user.toObject();
    u.token = token;
    u.password = undefined;
    return res.status(200).json({
      message: "Login Successfully",
      error: false,
      success: true,
      user: u,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

//reset password form- fetch email, send otp
export const resetPasswordOtpSend = async (req, res) => {
  try {
    // fetch email
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        error: true,
        success: false,
        message: "Something went wrong during fetching email",
      });
    }
    // find user is already registered
    const userExists = await UserModel.findOne({ email: email });

    if (!userExists) {
      return res.status(400).json({
        error: true,
        success: false,
        message: "User is not registered",
      });
    }
    const otp = otpgenerator.generate(4, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    //create entry in Db
    const newOtp = await OtpModel.create({ email: email, otp: otp });

    return res.status(200).json({
      error: false,
      success: true,
      message: "Otp sent successfully",
      otp: newOtp,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

//reset password otp verify
export const resetPasswordOtpVerify = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        error: true,
        success: false,
        message: "All fields are required",
      });
    }

    //find latest otp with user email
    const latestOtp = await OtpModel.findOne({ email }).sort({ createdAt: -1 });

    if (!latestOtp) {
      return res.status(400).json({
        error: true,
        success: false,
        message: "OTP not found",
      });
    }

    if (latestOtp.otp !== Number(otp)) {
      return res.status(400).json({
        error: true,
        success: false,
        message: "OTP not matched",
      });
    }

    return res.status(200).json({
      error: false,
      success: true,
      message: "OTP verified successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

//reset password
export const resetPassword = async (req, res) => {
  try {
    const { email, otp, password, confirmPassword } = req.body;
    const NumberOtp = Number(otp);
    if (!email || !otp || !password || !confirmPassword) {
      return res.status(400).json({
        error: true,
        success: false,
        message: "All fields are required",
      });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({
        error: true,
        success: false,
        message: "Password & confirm password not matched",
      });
    }

    //verify otp
    const latestOtp = await OtpModel.find({ email: email })
      .sort({ createdAt: -1 })
      .limit(1);

    if (!latestOtp.length) {
      return res.status(404).json({
        message: "OTP is expired",
        error: true,
        success: false,
      });
    }

    if (latestOtp[0].otp !== NumberOtp) {
      return res.status(400).json({
        message: "OTP is not valid",
        error: true,
        success: false,
      });
    }

    const user = await UserModel.findOne({ email: email }).select("+password");

    if (await bcryptjs.compare(password, user.password)) {
      return res.status(400).json({
        success: false,
        message: "New password must be different from existing password",
      });
    }

    const hashedPassword = await hashingPassword(password);

    const updatedUser = await UserModel.findByIdAndUpdate(
      { _id: user._id },
      {
        password: hashedPassword,
      },
      {
        new: true,
      },
    );

    const u = updatedUser.toObject();
    delete u.password;
    return res.status(200).json({
      error: false,
      success: true,
      message: "Password reset successfully",
      user: u,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

//user suggestion (People you may know api)
export const suggestUser = async (req, res) => {
  try {
    //fetch userId from middleware
    const userId = req.user.userId;
    if (!userId) {
      return res.status(400).json({
        error: true,
        success: false,
        message: "Something went wrong while fetching details.",
      });
    }

    //userDetails
    const userDetails = await UserModel.findById(userId).populate("following");
    if (!userDetails) {
      return res.status(404).json({
        error: true,
        success: false,
        message: "User not found",
      });
    }

    if (userDetails.following.length < 1) {
      //id's of all friends whom the user is following
       const allSuggestsUser = await UserModel.aggregate([
        // 1. Khud ko exclude karo
        {
          $match: {
            _id: { $ne: new mongoose.Types.ObjectId(userId)}, //new mongoose.Types.ObjectId("string_id") ka kaam hota hai normal String ko MongoDB ke binary "ObjectId" mein convert karna.
          },
        },
        // 2. Followers array ka count calculate karo (followersCount)
        {
          $addFields: {
            followersCount: { $size: "$followers" },
          },
        },
        // 3. Sabse zyada followers wale upar (Descending: -1)
        {
          $sort: {
            followersCount: -1,
          },
        },
        // 4. top 10 user
        {
          $limit: 10,
        },
        // 5. Remove Password (Security)
        {
          $project: {
            password: 0,
          },
        },
      ]);

         
      return res.status(200).json({
        error: false,
        success: true,
        data: allSuggestsUser,
      });
    }

    

    //collecting following Id's of user
    const followingId = userDetails.following.map((f) => f._id.toString());

    //find all following of friends
    const friendDetails = await UserModel.find({ _id: { $in: followingId } });

    //filtering id's of suggested users
    let suggestions = new Set();
    friendDetails.forEach((friend) => {
      friend.following.forEach((fof) => {
        const fofId = fof.toString();

        if (fofId !== userId && !followingId.includes(fofId)) {
          suggestions.add(fofId);
        }
      });
    });

    //converting Set(){"id's", "id's"} to array
    const arr = [...suggestions];

    //getting all user details of suggested users
    // CHANGED: Use 'let' instead of 'const' so it can be reassigned in the fallback below
    let allSuggestsUser = await UserModel.find({
      _id: { $in: arr },
    })
      .select("userName profilePicture about followers")
      .limit(20);

    // Fallback: If no friends-of-friends found, show random popular users
    if (allSuggestsUser.length === 0) {
      allSuggestsUser = await UserModel.find({
        _id: { $nin: [...followingId, userId] },
      })
        .select("userName profilePicture about followers")
        .limit(10);
    }

    //return response
    return res.status(200).json({
      error: false,
      success: true,
      data: allSuggestsUser,
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      success: false,
      message: error.message || error,
    });
  }
};
