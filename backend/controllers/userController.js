import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/error.js";
import { User } from "../models/userSchema.js";
import { v2 as cloudinary } from "cloudinary";
import { sendToken } from "../utils/jwtToken.js";

export const register = catchAsyncErrors(async (req, res, next) => {
    try {
        const {
            name,
            email,
            phone,
            address,
            password,
            role,
            firstNiche,
            secondNiche,
            thirdNiche,
            coverLetter,
        } = req.body;

        if (!name || !email || !phone || !address || !password || !role) {
            return next(new ErrorHandler(400, "All fields are required."));
        }
        if (role === "Job Seeker" && (!firstNiche || !secondNiche || !thirdNiche)) {
            return next(new ErrorHandler(400, "Please provide your preferred job niches."));
        }
  
      const existingUser = await User.findOne({ email });

      if (existingUser) {
        return next(new ErrorHandler(400, "Email is already registered."));
      }
  
      const userData = {
        name,
        email,
        phone,
        address,
        password,
        role,
        niches: { firstNiche, secondNiche, thirdNiche },
        coverLetter,
      };
  
      if (req.files && req.files.resume) {
        const { resume } = req.files;
       
        try {
          const cloudinaryResponse = await cloudinary.uploader.upload(
            resume.tempFilePath,
            { folder: "Job_Seekers_Resume" }
          );

          if (!cloudinaryResponse || cloudinaryResponse.error) {
            return next(
              new ErrorHandler(500, "Failed to upload resume to cloud.")
            );
          }

          userData.resume = {
            public_id: cloudinaryResponse.public_id,
            url: cloudinaryResponse.secure_url,
          };

        } catch (error) {
          return next(new ErrorHandler(500, "Failed to upload resume"));
        }
      }
  
      const user = await User.create(userData);
      sendToken(user, 201, res, "User Registered successfully.");

    } catch (error) {
      console.error("Unexpected Error:", error);
      next(error);
    }
  });


  export const login = catchAsyncErrors(async (req, res, next) => {
      const { role, email, password } = req.body;

      if (!email || !password || !role) {
        return next(new ErrorHandler(400, "Please enter email and password."));
      }

        const user = await User.findOne({ email }).select("+password");

        if (!user) {
          return next(new ErrorHandler(401, "Invalid Email or Password."));
        }

        const isPasswordMatched = await user.comparePassword(password);

        if (!isPasswordMatched) {
          return next(new ErrorHandler(401, "Invalid Email or Password."));
        }

        if (user.role !== role) {
          return next(new ErrorHandler(401, "Invalid Role."));
        }

        sendToken(user, 200, res, "User Logged In Sucessfully !");

  });

  export const logout = catchAsyncErrors(async (req, res, next) => {
    res.cookie("token", "", {
      expires: new Date(Date.now()),
      httpOnly: true,
    });

    res.status(200).json({
      success: true,
      message: "Logged out successfully.",
    });
  });

  export const getUser = catchAsyncErrors(async (req, res, next) => {
    const user = req.user;
    res.status(200).json({
      success: true,
      user,
    }); 
});


export const updateProfile = catchAsyncErrors(async (req, res, next) => {
    const newUserData = {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        address: req.body.address,
        coverLetter: req.body.coverLetter,
        niches: {
          firstNiche: req.body.firstNiche,
          secondNiche: req.body.secondNiche,
          thirdNiche: req.body.thirdNiche,
        },
      };

      const { firstNiche, secondNiche, thirdNiche } = newUserData.niches; // Destructuring niches from newUserData
       
      if(req.user.role === "Job Seeker" && (!firstNiche || !secondNiche || !thirdNiche)){
        return next(new ErrorHandler(400, "Please provide your preferred job niches."));
      }

      if(req.files){
        const resume = req.files.resume;

        if (resume) {
          const currentResumeId = req.user.resume.public_id; // Getting the current resume id

          if (currentResumeId) {
            await cloudinary.uploader.destroy(currentResumeId); // Deleting the current resume from cloudinary
          }

          const newResume = await cloudinary.uploader.upload(resume.tempFilePath, { // Uploading the new resume to cloudinary
            folder: "Job_Seekers_Resume",
          });

          newUserData.resume = { // Adding the new resume to newUserData
            public_id: newResume.public_id,
            url: newResume.secure_url,
          };
        }
      }

      const user = await User.findByIdAndUpdate(req.user.id, newUserData, {  // Updating the user profile
        new: true,
        runValidators: true,
        useFindAndModify: false,
      });

      res.status(200).json({
        success: true,
        user,
        message: "Profile updated Successfully.",
      });

});

export const updatePassword = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.user.id).select("+password");
    const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

    if (!isPasswordMatched) { 
        return next(new ErrorHandler(400, "Old password is incorrect."));
    }

    if (req.body.newPassword !== req.body.confirmPassword) {
        return next(new ErrorHandler(400, "Password does not match."));
    }

    user.password = req.body.newPassword;
    
    await user.save();

    sendToken(user, 200, res, "Password updated successfully.");
});
