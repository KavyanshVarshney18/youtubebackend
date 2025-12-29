const asyncHandler = (asyncfunc) => {
    return (req,res,next) =>  {
        Promise.resolve(asyncfunc(req,res,next)).catch((err)=> next(err))
    }
}


export default asyncHandler;


//2 way

// const asyncHandler = (func) => async (req,res,next)   => {
//     try {
//        await func(req,res,next){

//        }
        
//     } catch (err) {
//         res.status(err.code || 401).json({
//             success : false,
//             message : err.message
//         })
//     }
// }