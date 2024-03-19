const cors = require("cors");

module.exports = cors({
  origin: function (origin, callback) {
    if (
      [
        "http://localhost:3000",
        "https://888bingo.ph",
        "https://stagingapi2.888bingo.ph",
        "https://api2.888bingo.ph",
        "https://pf-backoffice.vercel.app",
        "https://platform-fe-azure.vercel.app"
      ].includes(origin) ||
      !origin
    ) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed"));
    }
  },
});
