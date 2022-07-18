const _ = require('lodash');
const formidable = require('formidable');
const fs = require('fs');
const {Product, validate} = require('../models/ProductModel');

const createProduct = async (req, res) =>{
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    // const form = formidable({ multiples: true });
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
                    if(err) res.status(500).send("Internal Server Error!!!");
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


//Query String
// api/product?order=desc&sortBy=name&limit=10
const getProducts = async (req, res) =>{
    // console.log(req.query)
    let order = req.query.order ==='desc'? -1:1;
    let sortBy = req.query.sortBy ? req.query.sortBy: "_id";
    let limit = req.query.limit ? parseInt(req.query.limit) : 10;
    const products = await Product.find()
        .select({photo: 0})
        .sort({[sortBy]:order})
        .limit(limit)
        .populate('category', 'name'); //populate() is mainly used to call the existing anything
    return res.status(200).send(products);
}


const getProductById = async (req, res) =>{
    const productId = req.params.id;
    const product = await Product.findById(productId)
        .select({photo: 0})
        .populate('category', 'name');
    if(!product) res.status(404).send("Product Not Founds!!!");
    return res.status(200).send(product);
}


const getProductPhoto = async (req, res) =>{
    const productId = req.params.id;
    const product = await Product.findById(productId)
        .select({photo:1, _id:0});
    res.set('Content-Type', product.photo.contentType);
    return res.status(200).send(product.photo.data);
}


// Collect Form Data
// Update Provided Form Fields
// Update photo (If provided)
const updateProductById = async (req, res) =>{
    const productId = req.params.id;
    const product = await Product.findById(productId);
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;

    form.parse(req, (err, fields, files) =>{
        if(err) return res.status(400).send("Something Wrong!!!");
        const updatedFields = _.pick(fields, ["name", "description", "price", "category", "quantity"]);
        _.assignIn(product, updatedFields);

        if(files.photo){
            fs.readFile(files.photo.path, (err, data) =>{
                if(err) return res.status(400).send("Something Went Wrong!!!");
                product.photo.data = data;
                product.photo.contentType = files.photo.type;
                product.save((err, result) =>{
                    if(err) return res.status(500).send("Something Failed!!!");
                    else return res.status(200).send({
                        message: "Product Updated Successfully!!!"
                    })
                })
            })
        }else{
            product.save((err, result) =>{
                if(err) return res.status(500).send("Something Failed!!!");
                else return res.status(200).send({
                    message: "Product Updated Successfully!!!"
                })
            })
        }
    })
}



// const body={
//     order: "desc",
//     sortBy:"price",
//     limit: 6,
//     skip: 20,
//     filters:{
//         price:[300,500],
//         category:["62d3f9a0dff4e7109e1b61e8","62d3c173417379fee80987ba"]
//     }
// }
// Products Filter by any fields
const filterProducts = async(req, res) =>{
    let order = req.body.order ==='desc'?-1:1;
    let sortBy = req.body.sortBy ? req.body.sortBy: "_id";
    let limit = req.body.limit ? parseInt(req.body.limit) : 10;
    let skip = parseInt(req.body.skip);
    let filters = req.body.filters;
    let args = {};

    for(let key in filters){
        if(filters[key].length > 0){
            if(key ==='price'){
                // {price:{$gte:0, $lte:500}}
                args['price'] ={
                    $gte: filters['price'][0],
                    $lte: filters['price'][1]
                }
                console.log(args);
            }
            
            if(key ==='category'){
                // category: {$in:['']}
                args['category'] = {
                    $in: filters['category']
                }
                console.log(args);
            }
        }
    }

    const products = await Product.find(args)
        .select({photo:0})
        .populate('category', 'name')
        .sort({[sortBy]: order})
        .skip(skip)
        .limit(limit)
    return res.status(200).send(products);
}


module.exports ={
    createProduct, getProducts,
    getProductById, updateProductById,
    getProductPhoto, filterProducts
}