const orderDetails = require("../models/OrderSchema");

async function persistOrderDetails(products, userId) {
  console.log(products);
  let total_bill = 0;
  products.map(function (product) {
    total_bill += product.quantity * product.price;
  });
  orderDetails.create({
    userid: userId,
    productids: products,
    total_bill,
  });
}

module.exports = persistOrderDetails;
