const hasDigits = (value = "") => /\d/.test(String(value))
const isDigitsOnly = (value = "") => /^\d+$/.test(String(value).trim())

const validateJobPayload = ({
    title,
    description,
    companyName,
    location,
    skillsRequired,
    experience,
    salary
}) => {
    if ([title, description, companyName, location].some((field) => hasDigits(field))) {
        return "Job title, company name, location, and description cannot contain numbers."
    }

    if ((skillsRequired || []).some((skill) => hasDigits(skill))) {
        return "Required skills cannot contain numbers."
    }

    if (!isDigitsOnly(experience)) {
        return "Experience must contain numbers only."
    }

    if (!isDigitsOnly(salary)) {
        return "Salary must contain numbers only."
    }

    return null
}

const validateUserProfilePayload = ({ name, skills, role }) => {
    if (name && hasDigits(name)) {
        return "Name cannot contain numbers."
    }

    if (role !== "recruiter" && role !== "admin" && Array.isArray(skills) && skills.some((skill) => hasDigits(skill))) {
        return "Skills cannot contain numbers."
    }

    return null
}

module.exports = {
    validateJobPayload,
    validateUserProfilePayload
}
