const express = require("express");
const app = express();
const path = require("path");
const routes = require("./routes");

const { generateError } = require("../helpers");

app.use(express.static(path.resolve(__dirname, "../client/build")));

Object.keys(routes).forEach((key) => {
  app.use(`/${key}`, routes[key]);
});

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../client/build", "index.html"));
});

app.use((req, res) => {
  return res.status(404).json(
    generateError({
      error: "Not Found",
      reasons: [
        {
          reason: "invalid_path",
          message: "The requested path could not be found",
          data: req.path,
          location: "path",
        },
      ],
    })
  );
});

const server = app.listen(process.env.WEB_PORT || 3000, () =>
  console.log(
    `Express Server is now listening on PORT: ${server.address().port}`
  )
);
