const _=require("lodash");
const {CartItemModel} = require("../models/CartItemModel");

const createCartItem = async(req, res) =>{
    let {price, product} = _.pick(req.body, ["price", "product"]);
    const item = await CartItemModel.findOne({
        user: req.user._id,
        product: product,
    });
    if(item) return res.status(400).send("Item already exists in Cart!!!");
    let cartItem = new CartItemModel({price:price, product:product, user:req.user._id});
    const result = await cartItem.save();
    res.status(201).send({
        message: "Successfully , added to cart!!!",
        data: result,
    })
}


const getCartItem = async(req, res) =>{
    const cartItems = await CartItemModel.find({
        user: req.user._id
    })
        .populate('product', 'name')
        .populate('user', 'name')
    return res.status(200).send(cartItems);
}


const updateCartItem = async(req, res) =>{
    const {_id, count} = _.pick(req.body, ["count", "_id"]);
    userId = req.user._id;
    await CartItemModel.updateOne({_id:_id, user:userId}, {count:count});
    return res.status(200).send("Successfully, Item Updated!!!")
}

const deleteCartItem = async(req, res) =>{
    const _id = req.params.id;
    userId = req.user._id;
    await CartItemModel.deleteOne({_id:_id, user:userId});
    return res.status(200).send("Item Deleted!!!");
}

module.exports={
    createCartItem, getCartItem,
    updateCartItem, deleteCartItem
}