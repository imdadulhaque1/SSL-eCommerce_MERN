const userRoute = require('../api/routers/userRoute');
const categoryRoute = require('../api/routers/categoryRoute');
const productRoute = require('../api/routers/productRoute');
const cartRouter = require("../api/routers/cartRoute");

module.exports = (app) => {
    app.use('/api/user', userRoute);
    app.use('/api/category', categoryRoute);
    app.use('/api/product', productRoute);
    app.use('/api/cart', cartRouter);
}