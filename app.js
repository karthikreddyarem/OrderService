const express = require("express");
const app = express();
const mongoose = require("mongoose");
const amqp = require("amqplib");
const configs = require("./config/configurations");
const createOrder = require("./scripts/createOrder");

var channel, connection;

app.use(express.json());


const cloudDbUrl = "mongodb+srv://endukuchepala:K@rthik01@credentials.efbelld.mongodb.net/?retryWrites=true&w=majority";
const localDburl = "mongodb://localhost/Credentials";

(async () => {
  await mongoose.connect("mongodb://localhost/Credentials");
  console.log("DB connection Established.");
})();

(async () => {
  const amqpServer = "amqp://localhost:5672";
  connection = await amqp.connect(amqpServer);
  channel = await connection.createChannel();
  await channel.assertQueue("ORDERQUEUE", { durable: true });
})().then(() => {
  channel.consume("ORDERQUEUE", (data) => {
    if (data) {
      console.log("Order Service receiving data.");
      const products = JSON.parse(data.content);
      console.log(products);
      const res = createOrder(JSON.parse(products.cartItems), products.userId);
      channel.ack(data);
    }
  });
});

app.listen(configs.APPLICATION_PORT, () => {
  console.log(
    `Order Service is ready to listen in port: ${configs.APPLICATION_PORT}.`
  );
});
