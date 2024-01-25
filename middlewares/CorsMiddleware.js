const cors = require("cors");

module.exports = cors({
  origin: function (origin, callback) {
    if (
      [
        "http://localhost:3000",
      ].includes(origin) ||
      !origin
    ) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed"));
    }
  },
});
