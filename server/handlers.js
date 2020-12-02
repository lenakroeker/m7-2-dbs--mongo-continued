"use strict";
const { MongoClient } = require("mongodb");

require("dotenv").config();
const { MONGO_URI } = process.env;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};
const getSeats = async (req, res) => {
  const client = await MongoClient(MONGO_URI, options);
  try {
    await client.connect();

    const db = client.db("ticketworkshop");

    db.collection("seats")
      .find()
      .toArray((err, results) => {
        console.log(results);
        res.status(200).json({
          status: 200,
          data: { seats: results, numOfRows: 8, seatsPerRow: 12 },
        });

        client.close();
      });
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = { getSeats };
