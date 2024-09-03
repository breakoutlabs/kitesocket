const express = require("express");
const cors = require("cors");

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

  const tokens = req.body.tokens || [];

  var ticker = new KiteTicker({
    api_key: "x6uczl4asdrgqdt8",
    access_token: "s1UNdoUI3yie0hVpcepI97kP7X3q3Xxi",
  });

  ticker.connect();
  ticker.on("ticks", onTicks);
  ticker.on("connect", subscribe);

  function onTicks(ticks) {
    console.log("Ticks", ticks);
    res.write(`data: ${JSON.stringify(ticks)}\n\n`);
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
  //   ticker.connect();
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
