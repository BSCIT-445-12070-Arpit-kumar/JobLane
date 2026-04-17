const Job = require('../models/JobModel')
const User = require('../models/UserModel')
const Application = require('../models/AppModel')
const cloudinary = require('cloudinary')
const { sendEmail } = require('../utils/sendEmail')
const { normalizeResumeAsset } = require('../utils/resumeAsset')
const { validateJobPayload } = require('../utils/inputValidation')

const hasCloudinaryConfig = Boolean(
    process.env.CLOUDINARY_NAME ||
    process.env.CLOUDINARY_CLOUD_NAME
)

const resolveApplicationResume = (application) => {
    const snapshotResume = application?.applicantResume
    const currentResume = application?.applicant?.resume

    if (snapshotResume?.url) {
        return normalizeResumeAsset(snapshotResume)
    }

    if (currentResume?.url) {
        return normalizeResumeAsset({
            public_id: currentResume.public_id || "default",
            url: currentResume.url
        })
    }

    return null
}

const buildAcceptanceEmail = ({ applicantName, recruiterName, jobTitle, companyName }) => {
    const safeApplicantName = applicantName || "Applicant"
    const safeJobTitle = jobTitle || "the role"
    const safeCompanyName = companyName || "the company"

    return {
        subject: "📢 Application Update",
        text: `📢 Application Update

Hello ${safeApplicantName},

Good news! Your application for ${safeJobTitle} at ${safeCompanyName} has been shortlisted by the recruiter.

You are invited to attend the next step of the recruitment process.

Please log in to your dashboard to view interview details and confirm your availability.

Best of luck! 🍀`,
        html: `
            <div style="margin:0;padding:0;background-color:#f4f7fb;font-family:Arial,Helvetica,sans-serif;color:#1f2937;">
                <div style="max-width:640px;margin:0 auto;padding:32px 16px;">
                    <div style="background:#111827;color:#ffffff;padding:24px 32px;border-radius:16px 16px 0 0;">
                        <div style="font-size:24px;font-weight:700;letter-spacing:0.5px;">📢 Application Update</div>
                        <div style="margin-top:8px;font-size:14px;color:#d1d5db;">JobLane Candidate Notification</div>
                    </div>

                    <div style="background:#ffffff;padding:32px;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 16px 16px;">
                        <p style="margin:0 0 16px;font-size:16px;line-height:1.7;">Hello <strong>${safeApplicantName}</strong>,</p>

                        <p style="margin:0 0 16px;font-size:16px;line-height:1.7;">
                            Good news! Your application for <strong>${safeJobTitle}</strong> at
                            <strong>${safeCompanyName}</strong> has been <strong>shortlisted by the recruiter</strong>.
                        </p>

                        <div style="margin:24px 0;padding:20px;border-radius:12px;background:#f9fafb;border:1px solid #e5e7eb;">
                            <p style="margin:0 0 8px;font-size:14px;color:#6b7280;">Position</p>
                            <p style="margin:0 0 16px;font-size:18px;font-weight:700;color:#111827;">${safeJobTitle}</p>
                            <p style="margin:0 0 8px;font-size:14px;color:#6b7280;">Company</p>
                            <p style="margin:0;font-size:16px;font-weight:600;color:#111827;">${safeCompanyName}</p>
                        </div>

                        <p style="margin:0 0 24px;font-size:16px;line-height:1.7;">
                            You are invited to attend the next step of the recruitment process.
                        </p>

                        <p style="margin:0 0 24px;font-size:16px;line-height:1.7;">
                            Please log in to your dashboard to view interview details and confirm your availability.
                        </p>

                        <div style="margin:24px 0 28px;">
                            <a href="https://joblane-frontend.onrender.com/login"
                               style="display:inline-block;background:#1d4ed8;color:#ffffff;text-decoration:none;padding:12px 20px;border-radius:10px;font-size:15px;font-weight:700;">
                                Open Dashboard
                            </a>
                        </div>

                        <p style="margin:0;font-size:16px;line-height:1.7;">Best of luck! 🍀</p>
                    </div>
                </div>
            </div>
        `
    }
}

const buildRejectionEmail = ({ applicantName, recruiterName, jobTitle, companyName }) => {
    const safeApplicantName = applicantName || "Candidate"
    const safeRecruiterName = recruiterName || "Recruiter"
    const safeJobTitle = jobTitle || "the role"
    const safeCompanyName = companyName || "the company"

    return {
        subject: `Application Update: ${safeJobTitle} at ${safeCompanyName}`,
        text: `Dear ${safeApplicantName},

Thank you for your interest in the position of ${safeJobTitle} at ${safeCompanyName} and for taking the time to submit your application.

After careful consideration, we regret to inform you that we will not be moving forward with your application at this time.

We received many strong applications, and this was a difficult decision. We encourage you to apply for other opportunities with ${safeCompanyName} in the future that match your skills and experience.

We sincerely appreciate your interest in joining our team and wish you the very best in your job search.

Best regards,
${safeRecruiterName}
${safeCompanyName}`,
        html: `
            <div style="margin:0;padding:0;background-color:#f4f7fb;font-family:Arial,Helvetica,sans-serif;color:#1f2937;">
                <div style="max-width:640px;margin:0 auto;padding:32px 16px;">
                    <div style="background:#111827;color:#ffffff;padding:24px 32px;border-radius:16px 16px 0 0;">
                        <div style="font-size:24px;font-weight:700;letter-spacing:0.5px;">Application Update</div>
                        <div style="margin-top:8px;font-size:14px;color:#d1d5db;">JobLane Candidate Notification</div>
                    </div>

                    <div style="background:#ffffff;padding:32px;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 16px 16px;">
                        <p style="margin:0 0 16px;font-size:16px;line-height:1.7;">Dear <strong>${safeApplicantName}</strong>,</p>

                        <p style="margin:0 0 16px;font-size:16px;line-height:1.7;">
                            Thank you for your interest in the position of <strong>${safeJobTitle}</strong> at
                            <strong>${safeCompanyName}</strong> and for taking the time to submit your application.
                        </p>

                        <p style="margin:0 0 16px;font-size:16px;line-height:1.7;">
                            After careful consideration, we regret to inform you that we will
                            <strong> not be moving forward with your application at this time</strong>.
                        </p>

                        <p style="margin:0 0 16px;font-size:16px;line-height:1.7;">
                            We received many strong applications, and this was a difficult decision.
                            We encourage you to apply for other opportunities with <strong>${safeCompanyName}</strong>
                            in the future that match your skills and experience.
                        </p>

                        <p style="margin:0 0 24px;font-size:16px;line-height:1.7;">
                            We sincerely appreciate your interest in joining our team and wish you the very best in your job search.
                        </p>

                        <p style="margin:0;font-size:15px;line-height:1.7;">Best regards,</p>
                        <p style="margin:4px 0 0;font-size:15px;line-height:1.7;font-weight:700;">${safeRecruiterName}</p>
                        <p style="margin:2px 0 0;font-size:15px;line-height:1.7;font-weight:700;">${safeCompanyName}</p>
                    </div>
                </div>
            </div>
        `
    }
}


exports.getAllJobs = async (req,res) => {
    try{
        const jobs = await Job.find() ;

        res.status(200).json({
            success: true,
            jobs
        })

    }catch(err){
        res.status(500).json({
            success: false,
            message: err.message
        })
    }                
}

exports.getAllUsers = async (req,res) => {
    try{
        const users = await User.find() ;

        res.status(200).json({
            success: true,
            users
        })

    }catch(err){
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
}

exports.getAllApp = async (req,res) => {
    try{
        const query = req.user.role === "recruiter"
            ? Application.find().populate({
                path: "job",
                match: { postedBy: req.user._id }
            }).populate("applicant")
            : Application.find().populate("job applicant") ;

        const applications = await query ;
        const filteredApplications = req.user.role === "recruiter"
            ? applications.filter((application) => application.job)
            : applications;

        const normalizedApplications = filteredApplications.map((application) => {
            const normalizedResume = resolveApplicationResume(application)

            if (!normalizedResume) {
                return application
            }

            return {
                ...application.toObject(),
                applicantResume: normalizedResume
            }
        })

        res.status(200).json({
            success: true,
            applications: normalizedApplications
        })

    }catch(err){
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
}

exports.updateApplication = async (req,res) => {
    try{

        const application = await Application.findById(req.params.id).populate("job applicant") ;

        if (!application) {
            return res.status(404).json({
                success: false,
                message: "Application not found"
            })
        }

        if (
            req.user.role === "recruiter" &&
            application.job &&
            application.job.postedBy.toString() !== req.user._id.toString()
        ) {
            return res.status(403).json({
                success: false,
                message: "You can only update applications for your own jobs"
            })
        }

        const previousStatus = application.status
        const requestedStatus = req.body.status
        const nextStatus = requestedStatus === "accepted" ? "selected" : requestedStatus
        const statusMessages = {
            selected: "Your application is shortlisted.",
            accepted: "Your application is shortlisted.",
            rejected: "Your application is rejected.",
            pending: "Your application is under review."
        }

        application.status = nextStatus ;
        application.statusMessage = statusMessages[nextStatus] || "Your application status was updated."

        await application.save() ;

        let emailSent = false
        let emailError = null

        const applicantUser = application.applicant?._id
            ? await User.findById(application.applicant._id).select("name email")
            : null

        const applicantEmail = applicantUser?.email || application.applicant?.email
        const applicantName = applicantUser?.name || application.applicant?.name || "Applicant"

        const recruiterName = req.user.name || "Recruiter"
        const jobTitle = application.job?.title || "the role"
        const companyName = application.job?.companyName || "our company"
        const shouldSendAcceptanceEmail =
            (requestedStatus === "accepted" || nextStatus === "selected") &&
            Boolean(applicantEmail)
        const shouldSendRejectionEmail =
            requestedStatus === "rejected" &&
            Boolean(applicantEmail)

        if (shouldSendAcceptanceEmail || shouldSendRejectionEmail) {
            const emailTemplate = shouldSendAcceptanceEmail
                ? buildAcceptanceEmail({
                    applicantName,
                    recruiterName,
                    jobTitle,
                    companyName
                })
                : buildRejectionEmail({
                    applicantName,
                    recruiterName,
                    jobTitle,
                    companyName
                })

            try {
                await sendEmail({
                    to: applicantEmail,
                    subject: emailTemplate.subject,
                    text: emailTemplate.text,
                    html: emailTemplate.html
                })
                emailSent = true
            } catch (mailErr) {
                emailError = mailErr.message
                console.log("Application status email could not be sent:", mailErr.message)
            }
        }

        if (
            (
                requestedStatus === "accepted" ||
                nextStatus === "selected" ||
                requestedStatus === "rejected"
            ) &&
            !applicantEmail
        ) {
            emailError = "Applicant email not found."
        }

        res.status(200).json({
            success: true,
            message: emailSent
                ? "Application accepted and email sent."
                : emailError
                    ? `Application accepted but email failed: ${emailError}`
                    : "Application Updated",
            application,
            emailSent,
            emailError
        })

    }catch(err){
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
}
exports.deleteApplication = async (req,res) => {
    try{

        const application = await Application.findByIdAndRemove(req.params.id) ;

        res.status(200).json({
            success: true ,
            message: "Application Deleted"
        })

    }catch(err){
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
}

exports.getApplication = async (req,res) => {
    try{
        const application = await Application.findById(req.params.id).populate("job applicant") ;

        if (!application) {
            return res.status(404).json({
                success: false,
                message: "Application not found"
            })
        }

        if (
            req.user.role === "recruiter" &&
            application.job &&
            application.job.postedBy.toString() !== req.user._id.toString()
        ) {
            return res.status(403).json({
                success: false,
                message: "You can only view applications for your own jobs"
            })
        }

        const normalizedResume = resolveApplicationResume(application)

        res.status(200).json({
            success: true,
            application: normalizedResume
                ? {
                    ...application.toObject(),
                    applicantResume: normalizedResume
                }
                : application
        })

    }catch(err){
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
}


exports.updateUser = async (req,res) => {
    try{
        const user = await User.findById(req.params.id) ;

        user.role = req.body.role ;

        await user.save() ;

        res.status(200).json({
            success: true,
            message: "User Updated"
        })

    }catch(err){
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
}

exports.deleteUser = async (req,res) => {
    try{
        const user = await User.findByIdAndRemove(req.params.id) ;

        res.status(200).json({
            success: true,
            message: "User Deleted"
        })

    }catch(err){
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
}

exports.getUser = async (req,res) => {
    try{
        const user = await User.findById(req.params.id) ;

        res.status(200).json({
            success: true,
            user
        })

    }catch(err){
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
}


exports.updateJob = async (req,res) => {
    try{    

        const job = await Job.findById(req.params.id) ;
        const incomingLogo = req.body.companyLogo
        const validationError = validateJobPayload({
            title: req.body.title,
            description: req.body.description,
            companyName: req.body.companyName,
            location: req.body.location,
            skillsRequired: req.body.skillsRequired,
            experience: req.body.experience,
            salary: req.body.salary
        })

        if (validationError) {
            return res.status(400).json({
                success: false,
                message: validationError
            })
        }

        let logoData = job.companyLogo || { public_id: "default", url: "https://via.placeholder.com/200?text=Company" }
        const isNewBase64Logo = typeof incomingLogo === "string" && incomingLogo.startsWith("data:image")

        if(isNewBase64Logo && job.companyLogo && job.companyLogo.public_id !== "default" && hasCloudinaryConfig) {
            try {
                await cloudinary.v2.uploader.destroy(job.companyLogo.public_id) ;
            } catch(err) {
                console.log("Failed to delete old logo")
            }
        }

        if(hasCloudinaryConfig && isNewBase64Logo) {
            try {
                const myCloud = await cloudinary.v2.uploader.upload(incomingLogo, {
                    folder: 'logo',
                    crop: "scale",
                })
                logoData = {
                    public_id: myCloud.public_id,
                    url: myCloud.secure_url
                }
            } catch(err) {
                console.log("Logo upload failed, using placeholder")
            }
        }

        req.body.companyLogo = logoData

        const updatedJob = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true }) ;

        

        res.status(200).json({
            success: true,
            message: "Job Updated"
        })

    }catch(err){
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
}


exports.getJob = async (req,res) => {
    try{    

        const job = await Job.findById(req.params.id)

        res.status(200).json({
            success: true,
            job
        })

    }catch(err){
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
}


exports.deleteJob = async (req,res) => {
    try{    

        const job = await Job.findByIdAndRemove(req.params.id)

        res.status(200).json({
            success: true,
            message: "Job Deleted"
        })

    }catch(err){
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
}
