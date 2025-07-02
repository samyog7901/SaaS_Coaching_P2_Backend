
import {Sequelize} from 'sequelize-typescript'
import {config} from "dotenv"
config()


const sequelize = new Sequelize({
    database : process.env.DB_NAME,
    username : process.env.DB_USERNAME,
    password : process.env.DB_PASSWORD,
    host : process.env.DB_HOST,
    dialect : 'mysql',
    port : Number(process.env.DB_PORT),
    models : [__dirname + '/models'] //current location of models + models folder -->('/models')
})

sequelize.authenticate()
.then(()=>{
    console.log('Database connected!')
})
.catch((error)=>{
    console.log(error)
})

//DB migration/ pushing
sequelize.sync({alter:false})
.then(()=>{
    console.log('Database synced!')
})


export default sequelize