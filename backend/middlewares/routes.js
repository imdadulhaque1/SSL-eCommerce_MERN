const userRoute = require('../api/routers/userRoute');
const categoryRoute = require('../api/routers/categoryRoute');
const productRoute = require('../api/routers/productRoute');


module.exports = (app) => {
    app.use('/api/user', userRoute);
    app.use('/api/category', categoryRoute);
    app.use('/api/product', productRoute);
}