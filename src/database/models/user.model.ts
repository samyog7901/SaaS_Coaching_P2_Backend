
import {Table,Column,Model,DataType} from 'sequelize-typescript'

@Table({
    tableName:'users', // gui ma dekhauney name
    modelName :'User', //project ma table access garne name
    timestamps : true
})

class User extends Model{
    @Column({
        type:DataType.UUID,
        primaryKey:true,
        defaultValue : DataType.UUIDV4
    })
    declare id:string

    @Column({
        type:DataType.STRING,
        allowNull:false
    })
    declare username:string
    @Column({
        type:DataType.STRING,
        allowNull:false,
        unique:true
    })
    declare email:string

    @Column({
        type:DataType.STRING,
        allowNull:false
    })
    declare password:string

    @Column({
        type:DataType.ENUM('teacher','institute','super-admin','student'),
        defaultValue :'student',
        allowNull:false
    })
    declare role:string

    @Column({
        type:DataType.STRING
    })
    declare currentInstituteNumber:string 

}

export default User