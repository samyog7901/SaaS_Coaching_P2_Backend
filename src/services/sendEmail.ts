
import nodemailer from 'nodemailer'


interface IMailInformation{
    to: string,
    subject: string,
    text: string
}

const sendMail = async (mailInformation:IMailInformation)=>{
    // mail pathaune logic goes here
    // 1. create nodemailer transport(configuration)

    const transporter = nodemailer.createTransport({
        service : 'gmail',
        auth: {
            user: process.env.NODEMAILER_GMAIL, //ed-tech platform email
            pass: process.env.NODEMAILER_GMAIL_APP_PASSWORD  //app-password
        }

    })

    const mailFormatObject ={
        from: process.env.NODEMAILER_GMAIL,
        to: mailInformation.to,
        subject: mailInformation.subject,
        text: mailInformation.text
    }

    try{
        const info = await transporter.sendMail(mailFormatObject)
        console.log("✅ Mail sent:", info.response)
        return true
    }catch(error){
        console.log(error)
        throw new Error("Mail not sent")
        return false
    }
}

export default sendMail
