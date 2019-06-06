const mysql = require("mysql");
const inquirer = require("inquirer");
const Table = require("cli-table2");

var connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "1Drose23",
    database: "bamazon_db",
    port: 3306
})

connection.connect(function(err){
   console.log("Connecterd as ID: " + connection.threadId);

   display();
});

//connection.connect();

var display = function() {
    connection.query("SELECT * FROM products", function(err, response) {
      if (err) throw err;
      console.log("-----------------------------");
      console.log("      Welcome To Bamazon    ");
      console.log("-----------------------------");
      console.log("");
      console.log("List of products \n");
      console.log("");
      var table = new Table({
        head: ["Product Id", "Product Description", "Cost", "Stock Quantity"],
        colWidths: [8, 25, 8,],
        colAligns: ["center", "left", "right"],
        style: {
          head: ["aqua"],
          compact: true
        }
      });
  
      for (var i = 0; i < response.length; i++) {
        table.push([response[i].id, response[i].product_name, response[i].price, response[i].stock_quantity]);
      }
      console.log(table.toString());
      console.log("");
      shopping();
    }); //End Connection
  };


  var shopping = function() {
    connection.query("SELECT * FROM products", function (err, response) {
        if (err) throw err;

        inquirer.prompt([{
            name: "id",
            type: "input",
            message: "Please enter the Product Id of the item you wish to purchase!"
        },{
            name: "quantity",
            type: "input",
            message: "How many would you like to purchase?"
        }]).then(function (answer) {
            var selection = parseInt(answer.id) -1;

            var updateQuantity = response[selection].stock_quantity;

            if(updateQuantity > answer.quantity) {
                console.log("\n");
                console.log("Your Order Is In Stock!");
                updateQuantity-= answer.quantity

                var totalPrice = answer.quantity * response[selection].price;
                console.log("The total price for " + response[selection].product_name + " is $" +totalPrice)

                var query2 = connection.query(
                    "UPDATE products SET ? WHERE ?",
                    [
                        { stock_quantity: updateQuantity },

                        {product_name:response[selection].product_name}
                    ],
                    function(err, res) {
                        console.log(" YOUR ORDER HAS BEEN PLACED! \n");
                    }
                )
            } else {
                console.log("WE ARE OUT OF STOCK " + response[selection].product_name + " Insufficient quantity! ")
            }
            connection.end();
        });
    });
}

