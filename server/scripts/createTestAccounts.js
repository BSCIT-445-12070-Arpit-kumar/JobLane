require('../config/loadEnv')
const mongoose = require('mongoose')
const User = require('./models/UserModel')
const bcrypt = require('bcrypt')

const createTestAccounts = async () => {
    try {
        // Connect to database
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })

        console.log('✅ Database Connected')

        // Hash for password: "password123"
        const hashedPassword = await bcrypt.hash('password123', 10)

        // Create Admin Account
        try {
            const admin = await User.create({
                name: "Admin User",
                email: "admin@joblane.com",
                password: hashedPassword,
                role: "admin",
                avatar: {
                    public_id: "default",
                    url: "https://via.placeholder.com/150"
                },
                skills: [],
                resume: {
                    public_id: "default",
                    url: "https://via.placeholder.com/150"
                }
            })
            console.log("✅ Admin Account Created:")
            console.log(`   Email: admin@joblane.com`)
            console.log(`   Password: password123`)
            console.log(`   Role: admin`)
        } catch (err) {
            if (err.code === 11000) {
                console.log("⚠️  Admin account already exists")
            } else {
                throw err
            }
        }

        // Create Recruiter Account
        try {
            const recruiter = await User.create({
                name: "Recruiter User",
                email: "recruiter@joblane.com",
                password: hashedPassword,
                role: "recruiter",
                avatar: {
                    public_id: "default",
                    url: "https://via.placeholder.com/150"
                },
                skills: [],
                resume: {
                    public_id: "default",
                    url: "https://via.placeholder.com/150"
                }
            })
            console.log("✅ Recruiter Account Created:")
            console.log(`   Email: recruiter@joblane.com`)
            console.log(`   Password: password123`)
            console.log(`   Role: recruiter`)
        } catch (err) {
            if (err.code === 11000) {
                console.log("⚠️  Recruiter account already exists")
            } else {
                throw err
            }
        }

        console.log("\n✅ Test accounts setup complete!")
        console.log("\n🔗 Login URLs:")
        console.log("   Admin:    http://localhost:5173/login/admin")
        console.log("   Recruiter: http://localhost:5173/login/recruiter")
        console.log("   Applicant: http://localhost:5173/login/applicant")

        process.exit(0)
    } catch (err) {
        console.error("❌ Error:", err.message)
        process.exit(1)
    }
}

createTestAccounts()
