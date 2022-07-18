const _=require('lodash');
const { Category, validate} = require('../models/CategoryModel');

const createCategory = async(req, res) =>{
    const {error} = validate(_.pick(req.body, ["name"]));
    if(error) returnres.status(400).send(error.details[0].message);

    const category = new Category(_.pick(req.body, ["name"]));
    const result = await category.save();

    return res.status(201).send({
        message: "Category Created Successfuly!!!",
        data:{
            name: result.name
        }
    })
}

const getCategory = async (req, res) =>{
    const categories = await Category.find()
        .select({_id:1, name:1})
        .sort({name:1})
    return res.status(200).send(categories);
}

module.exports={
    createCategory, getCategory
}