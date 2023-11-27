const express = require("express");
const app = express();
const mongoose = require("mongoose");
const amqp = require("amqplib");
const configs = require("./config/configurations");
const createOrder = require("./scripts/createOrder");

var channel, connection;

app.use(express.json());


const username = "hotelmanagement";
const password = "hotel";
const cloudDbUrl = "mongodb+srv://"+username +":"+ password+"@hotelmanagement.pbxdsak.mongodb.net/?retryWrites=true&w=majority";
const cloudamqp = "amqps://sariyfaw:Bpd0xsMTerAir2YQjeUMKXHXvvulXb_V@shark.rmq.cloudamqp.com/sariyfaw";
const localDburl = "mongodb://localhost/Credentials";
const localrabbitmq = "amqp://localhost:5672";

(async () => {
  await mongoose.connect(cloudDbUrl);
  console.log("DB connection Established.");
})();

(async () => {
  const amqpServer = cloudamqp;
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
