import { Response } from "express";
import { AuthRequest } from "../../../middleware/type";
import sequelize from "../../../database/connection"
import { QueryTypes } from "sequelize"



class CategoryController{
    static async createCategory(req:AuthRequest, res:Response) {
        const instituteNumber = req.user?.currentInstituteNumber
        const { categoryName, categoryDescription } = req.body

        if (!categoryName || !categoryDescription) {
            return res.status(400).json({ message: "Category name and description is required" })
        }

       
        await sequelize.query(`INSERT INTO category_${instituteNumber} (categoryName, categoryDescription) VALUES (?,?)`, {
            replacements: [categoryName, categoryDescription]
        })

        res.status(201).json({
            message: "Category added successfully"
        })
        
    }
    static async getCategories(req:AuthRequest, res:Response) {
        const instituteNumber = req.user?.currentInstituteNumber
        const categories = await sequelize.query(`SELECT * FROM category_${instituteNumber}`,
            {
                type : QueryTypes.SELECT,
                
        })
        
        if (categories.length === 0) {
            return res.status(404).json({ message: "No categories found" });
        }
        
        res.status(200).json({
            message: "Categories fetched successfully",
            data: categories
        })
    }
    static async deleteCategory(req:AuthRequest, res:Response) {
        const instituteNumber = req.user?.currentInstituteNumber
        const id =    req.params.id
        if (!id) {
            return res.status(400).json({ message: "Category ID is required" })
        }
        await sequelize.query(`DELETE FROM category_${instituteNumber} WHERE id = ?`, {
            replacements: [id]
        })
        res.status(200).json({
            message: "Category deleted successfully"
        })
    }
}

export default CategoryController