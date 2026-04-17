const Job = require('../models/JobModel')
const User = require('../models/UserModel')
const cloudinary = require('cloudinary')
const mongoose = require('mongoose');
const { validateJobPayload } = require('../utils/inputValidation')

const hasCloudinaryConfig = Boolean(
    process.env.CLOUDINARY_NAME ||
    process.env.CLOUDINARY_CLOUD_NAME
)

exports.createJob = async (req, res) => {
    try {

        const { title, description, companyName, location, logo, skillsRequired, experience, salary, category, employmentType } = req.body;

        console.log("Creating job with data:", { title, companyName, experience, salary, category, employmentType });

        // Validate required fields
        if (!title || !description || !companyName || !location || !experience || !salary || !category || !employmentType) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        if (!skillsRequired || skillsRequired.length === 0) {
            return res.status(400).json({
                success: false,
                message: "At least one skill is required"
            });
        }

        const validationError = validateJobPayload({
            title,
            description,
            companyName,
            location,
            skillsRequired,
            experience,
            salary
        })

        if (validationError) {
            return res.status(400).json({
                success: false,
                message: validationError
            })
        }

        let companyLogoData = { public_id: "default", url: "https://via.placeholder.com/200?text=" + encodeURIComponent(companyName) }

        // Only upload to cloudinary if credentials are configured and logo provided
        if (hasCloudinaryConfig && logo) {
            try {
                const myCloud = await cloudinary.v2.uploader.upload(logo, {
                    folder: 'logo',
                    crop: "scale",
                })
                companyLogoData = {
                    public_id: myCloud.public_id,
                    url: myCloud.secure_url
                }
                console.log("Logo uploaded to Cloudinary:", myCloud.secure_url);
            } catch (err) {
                console.log("Cloudinary upload failed, using placeholder:", err.message)
            }
        } else {
            console.log("Using placeholder logo (no Cloudinary credentials or logo provided)")
        }

        const newJob = await Job.create(
            {
                title,
                description,
                companyName,
                companyLogo: companyLogoData,
                location,
                skillsRequired,
                experience,
                category,
                salary,
                employmentType,
                postedBy: req.user._id

            }
        )

        console.log("Job created successfully:", newJob._id);

        res.status(200).json({
            success: true,
            message: "Job created successfully",
            newJob
        })


    } catch (err) {
        console.error("Error creating job:", err.message);
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
}


exports.allJobs = async (req, res) => {
    try {

        const Jobs = await Job.find();

        res.status(200).json({
            success: true,
            Jobs
        })

    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
}

exports.myJobs = async (req, res) => {
    try {

        const Jobs = await Job.find({ postedBy: req.user._id });

        res.status(200).json({
            success: true,
            Jobs
        })

    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
}


exports.oneJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id).populate('postedBy');

        res.status(200).json({
            success: true,
            job
        })

    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
}


exports.saveJob = async (req, res) => {
    try {

        const user = await User.findById(req.user._id);

        const JobId = req.params.id;

        if (user.savedJobs.includes(JobId)) {

            const jobIdObjectId = new mongoose.Types.ObjectId(JobId); 
            const arr = user.savedJobs.filter(jobid => jobid.toString() !== jobIdObjectId.toString());

            user.savedJobs = arr;
            await user.save();

            res.status(200).json({
                success: true,
                message: "Job UnSaved"
            })

        } else {
            const jobIdObjectId = new mongoose.Types.ObjectId(JobId); 
            user.savedJobs.push(jobIdObjectId);
            await user.save();
            res.status(200).json({
                success: true,
                message: "Job saved"
            })
        }

    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
}

exports.getSavedJobs = async (req,res) => {
    try{

        const user = await User.findById(req.user._id).populate('savedJobs'); ;
      


        res.status(200).json({
            success: true,
            savedJob: user.savedJobs
        })



    }catch(err){
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
}
