const express = require("express");
const cors = require("cors");
const axios = require("axios"); // Import axios for making HTTP requests

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

var KiteTicker = require("kiteconnect").KiteTicker;

app.get("/kite/stream", (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();

  const tokens = req.query.tokens ? req.query.tokens.split(",").map(Number) : [];

  var ticker = new KiteTicker({
    api_key: "x6uczl4asdrgqdt8",
    access_token: "1lNjSz094r0yStAkY2nHrDtLw0qb5e0u",
  });

  ticker.connect();
  ticker.on("ticks", onTicks);
  ticker.on("connect", subscribe);

  function onTicks(ticks) {
    // Send tick data to the client
    res.write(`data: ${JSON.stringify(ticks)}\n\n`);

    // Prepare data for Xano API
    const xanoData = {
      data: ticks, // Sending the ticks array directly
    };

    // POST data to the Xano API
    axios
      .post("https://xsnf-z0g0-zmkj.n7d.xano.io/api:mAgbAr1J/update_socket_data", xanoData)
      .then((response) => {
        console.log("Data successfully posted to Xano:", response.data);
      })
      .catch((error) => {
        console.error("Error posting data to Xano:", error);
      });
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
    // ticker.disconnect();
    // res.end();
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
