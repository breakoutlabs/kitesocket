const express = require("express");
const cors = require("cors");

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

var KiteTicker = require("kiteconnect").KiteTicker;

app.get("/kite/stream", (req, res) => {
  const tokens = req.query.tokens ? req.query.tokens.split(",").map(Number) : [];

  var ticker = new KiteTicker({
    api_key: "x6uczl4asdrgqdt8",
    access_token: "1lNjSz094r0yStAkY2nHrDtLw0qb5e0u",
  });

  let ticksArray = [];

  ticker.connect();
  ticker.on("ticks", onTicks);
  ticker.on("connect", subscribe);

  function onTicks(ticks) {
    ticksArray.push(...ticks);

    // You can add logic to send data periodically
    if (ticksArray.length > 10) {
      res.json(ticksArray);
      ticksArray = []; // Reset after sending
    }
  }

  function subscribe() {
    if (tokens.length > 0) {
      ticker.subscribe(tokens);
      ticker.setMode(ticker.modeFull, tokens);
    } else {
      console.log("No tokens provided for subscription");
    }
  }

  req.on("close", () => {
    console.log("Client disconnected");
    res.json(ticksArray); // Send whatever ticks were received before disconnect
  });
});


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
