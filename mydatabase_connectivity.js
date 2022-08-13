var mysql = require("mysql");

var connection = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "shopping",
  multipleStatements: true
});

module.exports = connection;
