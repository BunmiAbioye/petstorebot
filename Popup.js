// Bunmi Abioye
const Order = require("./Order");

const OrderState = Object.freeze({
    WELCOMING:   Symbol("welcoming"),
    SIZE:   Symbol("size"),
    SIDES:   Symbol("sides"),
    DRINKS:  Symbol("drinks"),
    PAYMENT: Symbol("payment")
});
// Constants - costs
const YES = 7;
const NO = 0;
const LARGE = 15;
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
    }
    handleInput(sInput){
        let aReturn = [];
        switch(this.stateCur){
            case OrderState.WELCOMING:
                this.stateCur = OrderState.SIZE;
                // First response                
                aReturn.push("Welcome to Bunmi's Popup Restaurant!");
                aReturn.push("Do you want our delicious fried rice? Please enter YES OR NO");
                break;
                // Second response with validation
            case OrderState.SIZE:
              if(sInput.toLowerCase() == "yes"){
                this.cCost = YES
                this.stateCur = OrderState.SIDES
                aReturn.push("Which sauced protein would you want with it? Please enter CHICKEN or LAMB");                   
            }
            else if(sInput.toLowerCase() == "no"){
                this.cCost = NO
                this.stateCur = OrderState.SIDES
                aReturn.push("Which sauced protein would you want with it? Please enter CHICKEN or LAMB");
            }
            
            else aReturn.push("Please enter the correct answer (YES OR NO)");
            this.sSize = sInput;
            break;
        // Third response with validation
            case OrderState.SIDES:
                if(sInput.toLowerCase() == "chicken" || sInput.toLowerCase() == "lamb"){
                    this.stateCur = OrderState.DRINKS
                    aReturn.push("How many bottles of water would you want with your order?");
                }
                else aReturn.push("Please enter the correct sauced protein - CHICKEN or LAMB");
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
                aReturn.push(`Your order will be delivered at: ${Object.values(sInput.purchase_units[0].shipping.address)}, by ${d.toTimeString()}`);
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
          src="https://www.paypal.com/sdk/js?client-id=${sClientID}"> // Required. Replace SB_CLIENT_ID with your sandbox client ID.
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