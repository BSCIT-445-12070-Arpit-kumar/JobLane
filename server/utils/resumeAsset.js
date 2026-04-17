const cloudinary = require('cloudinary')

const getResumeExtension = (resume = {}) => {
    const url = resume.url || ""
    const publicId = resume.public_id || ""
    const source = `${url} ${publicId}`.toLowerCase()

    if (source.includes(".jpeg")) {
        return "jpeg"
    }

    if (source.includes(".jpg")) {
        return "jpg"
    }

    if (source.includes(".png")) {
        return "png"
    }

    if (source.includes(".docx")) {
        return "docx"
    }

    if (source.includes(".doc")) {
        return "doc"
    }

    if (source.includes(".pdf")) {
        return "pdf"
    }

    return getResumeResourceType(resume) === "image" ? "jpg" : "pdf"
}

const getResumeResourceType = (resume = {}) => {
    const url = resume.url || ""

    if (url.includes("/image/upload/")) {
        return "image"
    }

    if (url.includes("/raw/upload/")) {
        return "raw"
    }

    return "raw"
}

const appendExtensionToPublicId = (publicId = "", extension = "pdf") => {
    if (!publicId) {
        return ""
    }

    return publicId.toLowerCase().endsWith(`.${extension}`)
        ? publicId
        : `${publicId}.${extension}`
}

const buildCloudinaryResumeUrl = (resume = {}, options = {}) => {
    if (!resume?.public_id) {
        return resume?.url || ""
    }

    const extension = getResumeExtension(resume)
    const resourceType = getResumeResourceType(resume)
    const publicIdWithExtension = appendExtensionToPublicId(resume.public_id, extension)

    return cloudinary.v2.url(publicIdWithExtension, {
        resource_type: resourceType,
        secure: true,
        type: "upload",
        sign_url: false,
        flags: options.asAttachment ? "attachment" : undefined
    })
}

const normalizeResumeAsset = (resume) => {
    if (!resume?.url && !resume?.public_id) {
        return resume
    }

    return {
        ...resume,
        url: buildCloudinaryResumeUrl(resume),
        downloadUrl: buildCloudinaryResumeUrl(resume, { asAttachment: true })
    }
}

module.exports = {
    normalizeResumeAsset,
    buildCloudinaryResumeUrl
}
