const itemsSchema = require("../../HotelService/models/ItemsSchema");
const persistOrder = require("./orderDetails");

async function createOrder(products, userId) {
  let total_price = 0;

  const items = await itemsSchema.find(
    {
      _id: {
        $in: products.map(function (product) {
          return product.id;
        }),
      },
    },
    {
      _id: 1,
      name: 1,
      quantity: 1,
      price: 1,
    }
  );

  let validItems = 0;
  products.map(function (product) {
    items.forEach((t) => {
      if (t.id === product.id && t.quantity >= product.quantity) {
        validItems += 1;
        t.quantity = product.quantity;
      }
    });
  });

  if (validItems !== products.length) {
    return { message: "InValid Cart" };
  }

  console.log(items);
  items.map(async function (product) {
    await itemsSchema.updateOne(
      { _id: product.id },
      { $inc: { quantity: product.quantity * -1 } }
    );
  });
  persistOrder(items, userId);
}

module.exports = createOrder;
