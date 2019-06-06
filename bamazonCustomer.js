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

   displayProducts()
});

//connection.connect();

//Function for displaying the products
function displayProducts() {
    console.log("-----------------------------");
    console.log("      Welcome To Bamazon    ");
    console.log("-----------------------------");
    console.log("");
    console.log("Find below our Products List");
    console.log("");
    //Collect table data from database
    connection.query("SELECT * FROM products", function (err, response) {
        if (err) throw err;
        for (var i = 0; i < response.length; i++) {
            console.log(response[i].id + ") " + response[i].product_name +" $"+response[i].price + " x " + response[i].stock_quantity);
        }
        console.log("\n");
        //Once data is collected start prompt to but porducts
        shopping();
    });
}

function shopping() {
    connection.query("SELECT * FROM products", function (err, response) {
        if (err) throw err;

        inquirer.prompt([{
            name: "id",
            type: "input",
            message: "What is the ID number of the product you wish to buy?"
        },{
            name: "quantity",
            type: "input",
            message: "How many would you like to purchase?"
        }]).then(function (answer) {
            var chosenItem = parseInt(answer.id) -1;

            var updateQuantity = response[chosenItem].stock_quantity;

            if(updateQuantity > answer.quantity) {
                console.log("\n");
                console.log("Your Order Is In Stock!");
                updateQuantity-= answer.quantity

                var totalPrice = answer.quantity * response[chosenItem].price;
                console.log("The total price for " + response[chosenItem].product_name + " is $" +totalPrice)

                var query2 = connection.query(
                    "UPDATE products SET ? WHERE ?",
                    [
                        {
                            stock_quantity: updateQuantity
                        },
                        {
                            product_name:response[chosenItem].product_name
                        }
                    ],
                    function(err, res) {
                        console.log(" YOUR ORDER HAS BEEN PLACED! \n");
                    }
                )
            } else {
                console.log("WE ARE OUT OF STOCK " + response[chosenItem].product_name + " Insufficient quantity! ")
            }
        });
    });
}

