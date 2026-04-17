const User = require('../models/UserModel')
const bcrypt = require('bcrypt')
const { createToken } = require('../middlewares/auth')
const cloudinary = require('cloudinary')
const { normalizeResumeAsset } = require('../utils/resumeAsset')
const { validateUserProfilePayload } = require('../utils/inputValidation')

const hasCloudinaryConfig = Boolean(
    process.env.CLOUDINARY_NAME ||
    process.env.CLOUDINARY_CLOUD_NAME
)
const isPdfDataUri = (value = "") => typeof value === "string" && value.startsWith("data:application/pdf")

exports.register = async (req, res) => {
    try {

        const { name, email, password, avatar, skills, resume, role } = req.body;

        let avatarData = { public_id: "default", url: "https://ui-avatars.com/api/?name=" + encodeURIComponent(name) + "&background=random" }
        let resumeData = null
        
        // Only process resume for applicants, not for recruiters or admins
        if (role !== "recruiter" && role !== "admin") {
            resumeData = { public_id: "default", url: "https://via.placeholder.com/150" }
        }

        const profileValidationError = validateUserProfilePayload({ name, skills, role })
        if (profileValidationError) {
            return res.status(400).json({
                success: false,
                message: profileValidationError
            })
        }

        if (resume && role !== "recruiter" && role !== "admin" && !isPdfDataUri(resume)) {
            return res.status(400).json({
                success: false,
                message: "Resume must be uploaded as a PDF file."
            })
        }

        if (hasCloudinaryConfig && avatar) {
            try {
                const myCloud = await cloudinary.v2.uploader.upload(avatar, {
                    folder: 'avatar',
                    crop: "scale",
                })
                avatarData = {
                    public_id: myCloud.public_id,
                    url: myCloud.secure_url
                }
            } catch (err) {
                console.log("Avatar upload failed, using default avatar")
            }
        }

        if (hasCloudinaryConfig && resume && role !== "recruiter" && role !== "admin") {
            try {
                const myCloud2 = await cloudinary.v2.uploader.upload(resume, {
                    folder: 'resume',
                    resource_type: "raw",
                    format: "pdf"
                })
                resumeData = normalizeResumeAsset({
                    public_id: myCloud2.public_id,
                    url: myCloud2.secure_url
                })
            } catch (err) {
                console.log("Resume upload failed")
            }
        }

        const hashPass = await bcrypt.hash(password, 10)
        const user = await User.create({
            name,
            email,
            password: hashPass,
            avatar: avatarData,
            skills,
            resume: resumeData,
            role: role || "applicant"
        })

        const token = createToken(user._id, user.email)

        res.status(201).json({
            success: true,
            message: "User Created",
            user,
            token,
            role: user.role
        })
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
}


exports.login = async (req, res) => {
    try {
        const { email, password, loginType } = req.body;

        if (loginType === "admin") {
            return res.status(403).json({
                success: false,
                message: "Admin login is not available from the public login page."
            })
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User does not exists"
            })
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Wrong Password"
            })
        }

        // Enforce login portal based on user role
        // - recruiter/admin must use their respective login pages
        // - applicants must use the standard login page
        const userRole = user.role || "applicant";

        if (loginType) {
            if (loginType !== userRole) {
                return res.status(401).json({
                    success: false,
                    message: `Please login via the ${userRole} portal.`
                })
            }
        } else {
            // If loginType is not provided, treat this as applicant login.
            // Prevent recruiters/admins from logging into applicant area.
            if (userRole !== "applicant") {
                return res.status(401).json({
                    success: false,
                    message: `Please login via the ${userRole} portal.`
                })
            }
        }

        const token = createToken(user._id, user.email)

        res.status(200).json({
            success: true,
            message: "User logged In Successfully",
            token,
            role: user.role
        })


    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
}


exports.isLogin = async (req, res) => {
    try {

        const user = await User.findById(req.user._id);

        if (user) {
            return res.status(200).json({
                success: true,
                isLogin: true
            })
        } else {
            return res.status(200).json({
                success: true,
                isLogin: false
            })
        }

    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
}

exports.me = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        const normalizedUser = user.toObject()
        normalizedUser.resume = normalizeResumeAsset(normalizedUser.resume)

        res.status(200).json({
            success: true,
            user: normalizedUser
        })

    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
}

exports.changePassword = async (req, res) => {
    try {

        const { oldPassword, newPassword, confirmPassword } = req.body;

        const user = await User.findById(req.user._id)

        const userPassword = user.password;

        const isMatch = await bcrypt.compare(oldPassword, userPassword);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Old password is wrong"
            })
        }

        if (newPassword === oldPassword) {
            return res.status(400).json({
                success: false,
                message: "New password is same as old Password"
            })
        }

        if (newPassword !== confirmPassword) {
            return res.status(401).json({
                success: false,
                message: "New Pasword and Confirm Password are not matching"
            })
        }

        const hashPass = await bcrypt.hash(newPassword, 10);

        user.password = hashPass;

        await user.save();

        res.status(200).json({
            success: true,
            message: "User password changed"
        })



    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
}

exports.updateProfile = async (req, res) => {
    try {
        const { newName, newEmail, newAvatar, newResume, newSkills } = req.body;

        const user = await User.findById(req.user._id);
        const resolvedName = newName || user.name
        const resolvedEmail = newEmail || user.email
        const resolvedSkills = newSkills ?? user.skills

        const profileValidationError = validateUserProfilePayload({
            name: resolvedName,
            skills: resolvedSkills,
            role: user.role
        })

        if (profileValidationError) {
            return res.status(400).json({
                success: false,
                message: profileValidationError
            })
        }

        if (user.role !== "recruiter" && newResume && !isPdfDataUri(newResume)) {
            return res.status(400).json({
                success: false,
                message: "Resume must be uploaded as a PDF file."
            })
        }

        // Delete old avatar only if it's not a default placeholder
        if(newAvatar && user.avatar && user.avatar.public_id !== "default" && hasCloudinaryConfig) {
            try {
                await cloudinary.v2.uploader.destroy(user.avatar.public_id) ;
            } catch(err) {
                console.log("Failed to delete old avatar")
            }
        }
        
        // Only delete and update resume for non-recruiters
        if(user.role !== "recruiter" && newResume && user.resume && user.resume.public_id !== "default" && hasCloudinaryConfig) {
            try {
                await cloudinary.v2.uploader.destroy(user.resume.public_id) ;
            } catch(err) {
                console.log("Failed to delete old resume")
            }
        }

        let newAvatarData = user.avatar || { public_id: "default", url: "https://ui-avatars.com/api/?name=" + encodeURIComponent(resolvedName) + "&background=random" }

        if(hasCloudinaryConfig && newAvatar) {
            try {
                const myCloud1 = await cloudinary.v2.uploader.upload(newAvatar, {
                    folder: 'avatar',            
                    crop: "scale",
                })
                newAvatarData = {
                    public_id: myCloud1.public_id,
                    url: myCloud1.secure_url
                }
            } catch(err) {
                console.log("Avatar upload failed, using default avatar")
            }
        } else if (!user.avatar?.url) {
            newAvatarData = {
                public_id: "default",
                url: "https://ui-avatars.com/api/?name=" + encodeURIComponent(resolvedName) + "&background=random"
            }
        }

        user.name = resolvedName
        user.email = resolvedEmail
        user.skills = resolvedSkills
        user.avatar = newAvatarData
        
        // Only update resume for non-recruiters
        if(user.role !== "recruiter" && newResume && hasCloudinaryConfig) {
            try {
                const myCloud2 = await cloudinary.v2.uploader.upload(newResume, {
                    folder: 'resume',           
                    resource_type: "raw",
                    format: "pdf"
                })
                user.resume = normalizeResumeAsset({
                    public_id: myCloud2.public_id,
                    url: myCloud2.secure_url
                })
            } catch(err) {
                console.log("Resume upload failed")
            }
        }

        await user.save()

        res.status(200).json({
            success: true,
            message: "Profile Updated"
        })


    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
}


exports.deleteAccount = async (req,res) => {
    try{

        const user = await User.findById(req.user._id) 

        const isMatch =  await bcrypt.compare(req.body.password, user.password);
        
        if(isMatch){
            await User.findByIdAndRemove(req.user._id) ;
        }else{
            return res.status(200).json({
                success: false,
                message: "Password does not match !"

            })
        }
        

        res.status(200).json({
            success: true,
            message: "Account Deleted"
        })

    }catch(err){
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
}
