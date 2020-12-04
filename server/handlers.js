"use strict";
const { MongoClient } = require("mongodb");
const assert = require("assert");
require("dotenv").config();
const { MONGO_URI } = process.env;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

//retrieve all seats data for redering seats

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

// book a seat

const bookSeat = async (req, res) => {
  const client = await MongoClient(MONGO_URI, options);

  await client.connect();

  const db = client.db("ticketworkshop");

  const { seatId, fullName, creditCard, expiration, email } = req.body;
  console.log(req.body);
  var query = { _id: seatId };
  const newValue = {
    $set: {
      isBooked: true,
      fullName: fullName,
      creditCard: creditCard,
      expiration: expiration,
      email: email,
    },
  };

  console.log(newValue, "newvalue");
  console.log(query, "query");

  const seat = await db.collection("seats").findOne(query);
  console.log(seat);
  if (!seat.isBooked) {
    try {
      const result = await db.collection("seats").updateOne(query, newValue);
      assert.equal(1, result.matchedCount);
      assert.equal(1, result.modifiedCount);
      res.status(200).json({ status: 200, _id: seatId });
    } catch (error) {
      console.log(error.message);
      res
        .status(500)
        .json({ status: 500, data: req.body, message: error.message });
    }
  } else {
    res
      .status(400)
      .json({ status: 400, data: req.body, message: "seat already booked" });
  }

  client.close();
};

module.exports = { getSeats, bookSeat };
