const {Schema, model} = require('mongoose');
const Joi = require('joi');

const Category = model('Category', Schema({
    name:{
        type: String,
        unique: true
    }
}, {timestamps: true}));

const validate = category=>{
    const schema = Joi.object({
        name: Joi.string().min(3).max(50).required()
    });
    return schema.validate(category);
}


module.exports={
    Category, validate
}