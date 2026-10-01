

export const requireClientId  = async(req,res,next) => {
    const clientId = req.headers['x-client-id']

    try{

        if(!clientId || clientId.length === 0){
            return res.status(400).json({message : "client id are required" ,status : false})
        }

        req.clientId = clientId
        next()

    }catch(err){
        console.log(err)
        return res.status(500).json({message : "server error",status : false})
    }
}