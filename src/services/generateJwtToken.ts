
import jwt from 'jsonwebtoken'

const generateJwtToken = (data: {
    id : string,
    instituteNumber ?: string
})=>{
    //@ts-ignore
    const token = jwt.sign({id:data.id,currentInstituteNumber : data.instituteNumber ?? null},process.env.JWT_SECRET!,{
        expiresIn : process.env.JWT_EXPIRATION
    })
    return token
    

}

export default generateJwtToken