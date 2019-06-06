const mysql = require("mysql");
const inquirer = ("inquirer");
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
    console.log("List of products \n");

    //Collect table data from database
    connection.query("SELECT * FROM products", function (err, response) {
        if (err) throw err;
        for (var i = 0; i < response.length; i++) {
            console.log(response[i].id + ") " + response[i].product_name +" $"+response[i].price);
        }
        console.log("\n");
        //Once data is collected start prompt to but porducts
        startPrompt();
    });
}

function startPrompt() {
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
            }
        })
    })
}

