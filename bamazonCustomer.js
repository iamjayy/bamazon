const mysql = require("mysql");
const inquirer = ("inquirer");
const table = require("cli-table2");

var connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "1Drose23",
    database: "bamazon_db",
    port: 3306
})
connection.connect();

var display = function() {
    connection.query("SELECT * FROM products", function(err,res){
        if(err) throw err;
        console.log("=================================")
        console.log("    WELCOME TO BAMAZON          ")
        console.log("==================================")
        console.log("")
        console.log("   FIND YOUR PRODUCS BELOW       ")
        console.log("")
    });
    var table = new Table({
        head: ["Product Id", "Product Description", "Cost"],
        colWidths: [12, 50, 8],
        colAligns: ["center", "left", "right"],
        style: {
            head: ["aqua"],
            compact: true
        }
    });
    for (var i = 0; i<res.length; i++){
        table.push([res[i].id, res[i].products_name, res[i].price]);
    }
    console.log(table.toString());
    console.log("");

};
display();
