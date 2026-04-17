const nodemailer = require('nodemailer')

let transporter
let senderWarningShown = false

const getSmtpConfig = () => ({
    host: process.env.SMTP_HOST?.trim(),
    port: process.env.SMTP_PORT?.trim(),
    secure: process.env.SMTP_SECURE?.trim(),
    user: process.env.SMTP_USER?.trim(),
    pass: process.env.SMTP_PASS?.replace(/\s+/g, ''),
    from: process.env.SMTP_FROM?.trim()
})

const getEnvelopeConfig = () => {
    const { host, user, from } = getSmtpConfig()
    const normalizedHost = host?.toLowerCase()
    const normalizedUser = user?.toLowerCase()
    const normalizedFrom = from?.toLowerCase()
    const customFromAllowed = process.env.SMTP_ALLOW_CUSTOM_FROM?.trim() === 'true'
    const hasCustomFrom = normalizedFrom && normalizedFrom !== normalizedUser
    const shouldForceAuthenticatedSender =
        !customFromAllowed &&
        hasCustomFrom &&
        normalizedHost?.includes('gmail')

    if (shouldForceAuthenticatedSender && !senderWarningShown) {
        senderWarningShown = true
        console.warn(
            'SMTP_FROM differs from SMTP_USER. Gmail sends mail from the authenticated SMTP_USER, so replies will go to SMTP_FROM via replyTo.'
        )
    }

    return {
        from: shouldForceAuthenticatedSender ? user : (from || user),
        replyTo: hasCustomFrom ? from : undefined
    }
}

const getTransporter = () => {
    if (transporter) {
        return transporter
    }

    const {
        host: SMTP_HOST,
        port: SMTP_PORT,
        secure: SMTP_SECURE,
        user: SMTP_USER,
        pass: SMTP_PASS
    } = getSmtpConfig()

    if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
        throw new Error("SMTP is not configured. Please set SMTP_HOST, SMTP_PORT, SMTP_USER and SMTP_PASS.")
    }

    transporter = nodemailer.createTransport({
        host: SMTP_HOST,
        port: Number(SMTP_PORT),
        secure: SMTP_SECURE === "true",
        auth: {
            user: SMTP_USER,
            pass: SMTP_PASS
        }
    })

    return transporter
}

exports.sendEmail = async ({ to, subject, text, html }) => {
    const { from, replyTo } = getEnvelopeConfig()

    if (!to) {
        throw new Error("Recipient email is required.")
    }

    await getTransporter().sendMail({
        from,
        replyTo,
        to,
        subject,
        text,
        html
    })
}
