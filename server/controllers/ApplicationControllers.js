const Job = require('../models/JobModel')
const User = require('../models/UserModel')
const Application = require('../models/AppModel')
const { normalizeResumeAsset } = require('../utils/resumeAsset')

const mongoose = require('mongoose')

exports.createApplication = async (req, res) => {
    try {

        const job = await Job.findById(req.params.id);
        if (!job) {
            return res.status(404).json({
                success: false,
                message: "Job not found"
            })
        }

        if (job.status === "closed") {
            return res.status(400).json({
                success: false,
                message: "This job is closed and no longer accepting applications."
            })
        }

        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        }

        if (user.role !== "applicant") {
            return res.status(403).json({
                success: false,
                message: "Only job seekers can apply for jobs."
            })
        }

        if (user.appliedJobs.includes(job._id)) {
            return res.status(400).json({
                success: false,
                message: "you are already applied"
            })
        }

        // Handle resume - use default if not available
        const resume = user.resume && user.resume.url 
            ? normalizeResumeAsset({ public_id: user.resume.public_id || "default", url: user.resume.url })
            : { public_id: "default", url: "https://via.placeholder.com/200?text=Resume" }

        const application = await Application.create(
            {
                job: job._id,
                applicant: user._id,
                applicantResume: resume,
                statusMessage: "Your application is under review."
            }
        )
        user.appliedJobs.push(job._id)
        await user.save();

        console.log("Application created:", application._id);

        res.status(200).json({
            success: true,
            message: "Application created",
            application
        })


    } catch (err) {
        console.error("Error creating application:", err.message);
        res.status(500).json({
            success: false,
            message: err.message
        })
    }

}


exports.getSingleApplication = async (req, res) => {
    try {
        const application = await Application.findById(req.params.id).populate('job applicant');

        res.status(200).json({
            success: true,
            application
        })

    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
}


exports.getUsersAllApplications = async (req, res) => {
    try {
        const allApplications = await Application.find({ applicant: req.user._id }).populate('job')
            .populate('applicant');

        res.status(200).json({
            success: true,
            allApplications
        })


    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
}

exports.deleteApplication = async (req, res) => {
    try {

        const user = await User.findById(req.user._id);
       
        const applicationId = req.params.id;     

        const application = await Application.findById(req.params.id) 
        

        if(!application){
            return res.status(400).json({
                success: false,
                message: "Application already deleted"
            })
        }
       
        const applicationToDelete = await Application.findByIdAndRemove(applicationId);
       
        const jobId = application.job
        const MongooseObjectId = new mongoose.Types.ObjectId(jobId)

        const newAppliedJobs = user.appliedJobs.filter((e) => (
            e.toString() !== MongooseObjectId.toString()
        ))
    
        
        user.appliedJobs = newAppliedJobs;


        await user.save();

        res.status(200).json({
            success: true,
            message: "Application deleted"
        })
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        })
    }

}
