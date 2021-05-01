// Bunmi Abioye
const Order = require("./Order");
const fetch = require('sync-fetch');


const OrderState = Object.freeze({
    WELCOMING:   Symbol("welcoming"),
    SIZE:   Symbol("size"),
    SIDES:   Symbol("sides"),
    DRINKS:  Symbol("drinks"),
    PAYMENT: Symbol("payment")
});
// Constants - costs
const A = 10;
const B = 10;
const C = 10;
const BOTTLEWATER = 1;
const DELIVERY_TIME = 40;
// Tax rate
const TAX = 0.13;
//generate constructors - initiates the variable parameters
module.exports = class ChickenTotalCost extends Order{
    constructor(sNumber, sUrl){
        super(sNumber, sUrl);
        this.stateCur = OrderState.WELCOMING;
        this.sSize = "";
        this.sSides = "";
        this.sDrinks = "";
        this.sItem = "Grilled Chicken drumstick";
        this.cCost = 0;
        this.wCost = 0;
        this.totalCost = 0;
        this.tCost = 0;
        this.tax = 0;
        global.dishes = [];
        global.dishObjects = [];
    }
    handleInput(sInput){
        let aReturn = [];
        switch(this.stateCur){
            case OrderState.WELCOMING:
                this.stateCur = OrderState.SIZE;
                // First response                
                aReturn.push("Welcome to Bunmi's Popup Restaurant!");
                aReturn.push("Which of the dishes do you want from below menu list? Enter A, B or C");
                aReturn.push("A for the first menu, B for the second menu and C for the third menu");

                const oJson = fetch("https://prog8110a-default-rtdb.firebaseio.com/meals.json").json();
                console.log(oJson);
                Object.keys(oJson).map((key) => {
                    const oEntity = oJson[key];
                    global.dishObjects.push({
                      key:   oEntity.title.toLowerCase(),
                      value: oEntity
                  });
                    global.dishes.push(oEntity.title.toLowerCase());
                    oEntity.id = key;
                    aReturn.push("Dish: " + oEntity.title + "\n" +
                                "Description: " + oEntity.full_description + "\n" +
                                "Pickup Location: " + oEntity.location +"\n" +
                                "Date and Time: " + oEntity.date_of_event +"\n");
    
                });
                console.log("Dict Values - "+ JSON.stringify(global.dishObjects));
                console.log("Dishes-", JSON.stringify(global.dishes));
                break;
                // Second response with validation
            case OrderState.SIZE:
              if(sInput.toLowerCase() == "a"){
                this.cCost = A
                this.stateCur = OrderState.SIDES
                aReturn.push("Do you want it delivered? Please enter YES or NO");                   
            }
            else if(sInput.toLowerCase() == "b"){
                this.cCost = B
                this.stateCur = OrderState.SIDES
                aReturn.push("Do you want it delivered? Please enter YES or NO");
            }
            else if(sInput.toLowerCase() == "c"){
                this.cCost = C
                this.stateCur = OrderState.SIDES
                aReturn.push("Do you want it delivered? Please enter YES or NO");
            }
            else aReturn.push("Please enter the correct answer (A, B Or C)");
            this.sSize = sInput;
            break;
            
        // Third response with validation
            case OrderState.SIDES:
                if(sInput.toLowerCase() == "yes" || sInput.toLowerCase() == "no"){
                    this.stateCur = OrderState.DRINKS
                    aReturn.push("How many bottles of water would you want with your order?");
                }
                else aReturn.push("Do you want it delivered? Please enter YES or NO");
                this.sSides = sInput;
                break;
            case OrderState.DRINKS:
                this.stateCur = OrderState.PAYMENT;
                if(!isNaN(sInput) && sInput >= 0){                   
                  this.isDone(true);
                  this.wCost = BOTTLEWATER * sInput;
                  this.sWater = sInput;
                  this.tCost = this.cCost + this.wCost;
                  this.tax = TAX * this.tCost;
                  this.totalCost = this.cCost + this.wCost + this.tax;
                  aReturn.push(`Thanks for your order of ${this.sSize} ${this.sItem} at $${this.cCost} with ${this.sSides}`);
                  if(sInput > 0){
                      aReturn.push(`and '${this.sWater}' bottle(s) of water at $${this.wCost}`);
                  }
                  aReturn.push(`Tax is $${this.tax.toFixed(2)}, your order costs $${this.totalCost.toFixed(2)} in total.`)
                  aReturn.push(`Please pay for your order here`);
                aReturn.push(`${this.sUrl}/payment/${this.sNumber}/`);
              }
              else {
                  aReturn.push("Please enter a valid digit for the number of water bottles you want");
              }
              break;               
            case OrderState.PAYMENT:
                console.log(sInput);             
                this.isDone(true);
                let d = new Date(); 
                  d.setMinutes(d.getMinutes() + DELIVERY_TIME);
                aReturn.push(`Thank you, Your order will be delivered at: ${Object.values(sInput.purchase_units[0].shipping.address)}`);
                break;
        }
        return aReturn;
    }
    renderForm(){
      //  client id is kept private
      const sClientID = process.env.SB_CLIENT_ID || 'put your client id here for testing ... Make sure that you delete it before committing'
      return(`
      <!DOCTYPE html>
  
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1"> <!-- Ensures optimal rendering on mobile devices. -->
        <meta http-equiv="X-UA-Compatible" content="IE=edge" /> <!-- Optimal Internet Explorer compatibility -->
      </head>
      
      <body>
        <script src="https://code.jquery.com/jquery-3.5.1.min.js"></script>
        <script
          src="https://www.paypal.com/sdk/js?client-id=AaW95bIGsKjXZwdczupZRmwQxyKhnIZFek7XTTjUhnA_hUV7wgz2tBC0V8m8XZiXXvgsKfDR9p4xVpea"> // Required. Replace SB_CLIENT_ID with your sandbox client ID.
        </script>
        Thank you ${this.sNumber} for your order of $${this.totalCost}.
        <div id="paypal-button-container"></div>
  
        <script>
          paypal.Buttons({
              createOrder: function(data, actions) {
                // This function sets up the details of the transaction, including the amount and line item details.
                return actions.order.create({
                  purchase_units: [{
                    amount: {
                      value: '${this.totalCost}'
                    }
                  }]
                });
              },
              onApprove: function(data, actions) {
                // This function captures the funds from the transaction.
                return actions.order.capture().then(function(details) {
                  // This function shows a transaction success message to your buyer.
                  $.post(".", details, ()=>{
                    window.open("", "_self");
                    window.close(); 
                  });
                });
              }
          
            }).render('#paypal-button-container');
          // This function displays Smart Payment Buttons on your web page.
        </script>
      
      </body>
          
      `);
  
    }
}