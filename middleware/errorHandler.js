const errorHandler = (err, req, res, next)=>{
    let statusCode = err.statusCode || 500
    let message = err.message || "internal server error"
    return res.status(statusCode).json({
        successfull: false,
        statusCode,
        message
    })
}
export default errorHandler