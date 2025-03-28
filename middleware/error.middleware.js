
const customError = (statusCode, message) => {
    const error = new Error(message)
    error.statusCode = statusCode
    return (error)
}

const verifyDetails = (req, res, next) => {
    const { email, password, userName } = req.body
    if (!email || !password || !userName) {
        return res.status(403).json({ message: "Email and Password required" })
    }
    next()
}

export { customError, verifyDetails}