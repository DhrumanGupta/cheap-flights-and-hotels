import twilio from 'twilio'

const phoneNumber = process.env.PHONE_NUMBER || ''
const accountSid = process.env.ACCOUNT_SID
const authToken = process.env.AUTH_TOKEN

const twilioClient = twilio(accountSid, authToken)

const sendMessage = async (phone: string | undefined, message: string) => {
    if (!phone) {
        return
    }

    await twilioClient.messages
        .create({
            body: message,
            from: phoneNumber,
            to: phone,
        })
        .catch(console.error)
}

export { sendMessage }
