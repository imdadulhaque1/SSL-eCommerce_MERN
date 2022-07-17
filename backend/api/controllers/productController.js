const _ = require('lodash');
const formidable = require('formidable');
const fs = require('fs');
const {valid} = require('joi');
const {Product, validate} = require('../models/ProductModel');

const createProduct = async (req, res) =>{
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) =>{
        if (err) return res.status(400).send("Something went wrong!!!");
        const {error} = validate(_.pick(fields, ["name", "description", "price", "category", "quantity"]));
        if(error) return res.status(400).send(error.details[0].message);

        const product = new Product(fields);

        if(files.photo){
            // <input type="file" name="photo" />
            fs.readFile(files.photo.path, (err, data) =>{
                if(err) return res.status(400).send("Problem in file data!!!");
                product.photo.data = data;
                product.photo.contentType = files.photo.type;
                product.save((err, result) =>{
                    if(err) res.status(500).send("INternal Server Error!!!");
                    else return res.status(201).send({
                        message:"Successfully, Product Created!!!",
                        data: _.pick(result, ["name", "description", "price", "category", "quantity"])
                    })
                })
            })
        }else{
            return res.status(400).send("No image Provided!!!")
        }
    })
}
const getAllProduct = async (req, res) =>{
    
}
const getProductById = async (req, res) =>{
    
}
const updateProductById = async (req, res) =>{
    
}

module.exports ={
    createProduct, getAllProduct,
    getProductById, updateProductById
}