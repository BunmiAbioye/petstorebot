const Order = require("./Order");

const OrderState = Object.freeze({
    WELCOMING:   Symbol("welcoming"),
    FOOD:   Symbol("food"),
    LITTER:   Symbol("litter"),
    EXTRAS:  Symbol("extras")
});

module.exports = class LockDownEssentials extends Order{
    constructor(sNumber, sUrl){
        super(sNumber, sUrl);
        this.stateCur = OrderState.WELCOMING;
        this.sSpecies = "";
        this.sFood = "";
        this.sLitter = "";
        this.sExtras = "";
    }
    handleInput(sInput){
        let aReturn = [];
        switch(this.stateCur){
            case OrderState.WELCOMING:
                this.stateCur = OrderState.FOOD;
                aReturn.push("Welcome to Richard's Pet Store.");
                aReturn.push(`For a list of what we sell tap:`);
                aReturn.push(`${this.sUrl}/payment/${this.sNumber}/`);
                if(sInput.toLowerCase() == "meow"){
                  this.sSpecies = "cat";
                }else if(sInput.toLowerCase() == "woof") {
                  this.sSpecies = "dog";
                } else {
                  this.stateCur = OrderState.WELCOMING;
                  aReturn.push("Please type MEOW if you have a cat or WOOF if you have a dog.");
                  break;
                }
                aReturn.push("Would you like CANNED or DRY food or NO?");
                break;
            case OrderState.FOOD:
                if(this.sSpecies == "cat"){
                  this.stateCur = OrderState.LITTER;
                  aReturn.push("Would you like kitty litter?");
                }else{
                  this.stateCur = OrderState.EXTRAS;
                  aReturn.push("Would you like a TREAT or TOY for your dog?");
                }
                if(sInput.toLowerCase()!= "no"){
                  this.sFood = sInput;
                }
                break;
            case OrderState.LITTER:
                this.stateCur = OrderState.EXTRAS
                if(sInput.toLowerCase()!= "no"){
                  this.sLitter = "organic kitty litter";
                }
                aReturn.push("Would you like a TREAT or TOY for your kitty?");
                break;
            case OrderState.EXTRAS:
                if(sInput.toLowerCase() != "no"){
                    this.sExtras = sInput;
                }
                aReturn.push("Thank-you for your order of");
                this.nTotal = 0;
                if(this.sSpecies == "cat" && this.sFood.toLowerCase() == "canned"){
                  aReturn.push("canned cat food");
                  this.nTotal += 5.99;
                }else if(this.sSpecies == "cat" && this.sFood.toLowerCase == "dry"){
                  aReturn.push("dry cat food");
                  this.nTotal += 2.99
                }else if(this.sSpecies == "dog" && this.sFood.toLowerCase() == "canned"){
                  aReturn.push("canned dog food");
                  this.nTotal += 5.99;
                }else if(this.sSpecies == "dog" && this.sFood.toLowerCase == "dry"){
                  aReturn.push("dry dog food");
                  this.nTotal += 5.99
                }
                if(this.sLitter){
                  aReturn.push(this.sLitter);
                  this.nTotal += 2.99;
                }
                if(this.sExtras){
                  aReturn.push(this.sExtras);
                  this.nTotal += 2.99;
                }
                aReturn.push(`Your total comes to ${this.nTotal}`);
                aReturn.push(`We will text you from 519-222-2222 when your order is ready or if we have questions.`)
                this.isDone(true);
                break;
        }
        return aReturn;
    }
    renderForm(){
      // your client id should be kept private
      return(`
      <html>
      <head>
          <meta content="text/html; charset=UTF-8" http-equiv="content-type">
          <style type="text/css">
              ol {
                  margin: 0;
                  padding: 0
              }
      
              table td,
              table th {
                  padding: 0
              }
      
              .c1 {
                  border-right-style: solid;
                  padding: 5pt 5pt 5pt 5pt;
                  border-bottom-color: #000000;
                  border-top-width: 1pt;
                  border-right-width: 1pt;
                  border-left-color: #000000;
                  vertical-align: top;
                  border-right-color: #000000;
                  border-left-width: 1pt;
                  border-top-style: solid;
                  border-left-style: solid;
                  border-bottom-width: 1pt;
                  width: 234pt;
                  border-top-color: #000000;
                  border-bottom-style: solid
              }
      
              .c13 {
                  color: #000000;
                  font-weight: 400;
                  text-decoration: none;
                  vertical-align: baseline;
                  font-size: 36pt;
                  font-family: "Arial";
                  font-style: normal
              }
      
              .c0 {
                  color: #000000;
                  font-weight: 400;
                  text-decoration: none;
                  vertical-align: baseline;
                  font-size: 26pt;
                  font-family: "Arial";
                  font-style: normal
              }
      
              .c2 {
                  color: #000000;
                  font-weight: 400;
                  text-decoration: none;
                  vertical-align: baseline;
                  font-size: 11pt;
                  font-family: "Arial";
                  font-style: normal
              }
      
              .c9 {
                  padding-top: 12pt;
                  padding-bottom: 0pt;
                  line-height: 1.0;
                  orphans: 2;
                  widows: 2;
                  text-align: left;
                  height: 11pt
              }
      
              .c12 {
                  padding-top: 12pt;
                  padding-bottom: 0pt;
                  line-height: 1.0;
                  orphans: 2;
                  widows: 2;
                  text-align: left
              }
      
              .c3 {
                  padding-top: 0pt;
                  padding-bottom: 0pt;
                  line-height: 1.15;
                  orphans: 2;
                  widows: 2;
                  text-align: left
              }
      
              .c10 {
                  padding-top: 0pt;
                  padding-bottom: 0pt;
                  line-height: 1.0;
                  orphans: 2;
                  widows: 2;
                  text-align: left
              }
      
              .c4 {
                  padding-top: 0pt;
                  padding-bottom: 7pt;
                  line-height: 1.15;
                  orphans: 2;
                  widows: 2;
                  text-align: right
              }
      
              .c8 {
                  padding-top: 0pt;
                  padding-bottom: 7pt;
                  line-height: 1.15;
                  orphans: 2;
                  widows: 2;
                  text-align: left
              }
      
              .c11 {
                  border-spacing: 0;
                  border-collapse: collapse;
                  margin-right: auto
              }
      
              .c5 {
                  background-color: #ffffff;
                  max-width: 468pt;
                  padding: 72pt 72pt 72pt 72pt
              }
      
              .c6 {
                  height: 48.2pt
              }
      
              .c7 {
                  height: 52pt
              }
      
              .c15 {
                  font-size: 26pt
              }
      
              .c14 {
                  height: 11pt
              }
      
              .title {
                  padding-top: 0pt;
                  color: #000000;
                  font-size: 26pt;
                  padding-bottom: 3pt;
                  font-family: "Arial";
                  line-height: 1.15;
                  page-break-after: avoid;
                  orphans: 2;
                  widows: 2;
                  text-align: left
              }
      
              .subtitle {
                  padding-top: 0pt;
                  color: #666666;
                  font-size: 15pt;
                  padding-bottom: 16pt;
                  font-family: "Arial";
                  line-height: 1.15;
                  page-break-after: avoid;
                  orphans: 2;
                  widows: 2;
                  text-align: left
              }
      
              li {
                  color: #000000;
                  font-size: 11pt;
                  font-family: "Arial"
              }
      
              p {
                  margin: 0;
                  color: #000000;
                  font-size: 11pt;
                  font-family: "Arial"
              }
      
              h1 {
                  padding-top: 20pt;
                  color: #000000;
                  font-size: 20pt;
                  padding-bottom: 6pt;
                  font-family: "Arial";
                  line-height: 1.15;
                  page-break-after: avoid;
                  orphans: 2;
                  widows: 2;
                  text-align: left
              }
      
              h2 {
                  padding-top: 18pt;
                  color: #000000;
                  font-size: 16pt;
                  padding-bottom: 6pt;
                  font-family: "Arial";
                  line-height: 1.15;
                  page-break-after: avoid;
                  orphans: 2;
                  widows: 2;
                  text-align: left
              }
      
              h3 {
                  padding-top: 16pt;
                  color: #434343;
                  font-size: 14pt;
                  padding-bottom: 4pt;
                  font-family: "Arial";
                  line-height: 1.15;
                  page-break-after: avoid;
                  orphans: 2;
                  widows: 2;
                  text-align: left
              }
      
              h4 {
                  padding-top: 14pt;
                  color: #666666;
                  font-size: 12pt;
                  padding-bottom: 4pt;
                  font-family: "Arial";
                  line-height: 1.15;
                  page-break-after: avoid;
                  orphans: 2;
                  widows: 2;
                  text-align: left
              }
      
              h5 {
                  padding-top: 12pt;
                  color: #666666;
                  font-size: 11pt;
                  padding-bottom: 4pt;
                  font-family: "Arial";
                  line-height: 1.15;
                  page-break-after: avoid;
                  orphans: 2;
                  widows: 2;
                  text-align: left
              }
      
              h6 {
                  padding-top: 12pt;
                  color: #666666;
                  font-size: 11pt;
                  padding-bottom: 4pt;
                  font-family: "Arial";
                  line-height: 1.15;
                  page-break-after: avoid;
                  font-style: italic;
                  orphans: 2;
                  widows: 2;
                  text-align: left
              }
          </style>
      </head>
      
      <body class="c5">
          <p class="c3"><span
                  class="c2">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
          </p>
          <p class="c10"><span class="c0">For curbside pickup:</span></p>
          <p class="c12"><span class="c15">Text &ldquo;meow&rdquo; or &ldquo;woof&rdquo; to </span><span
                  class="c13">519-111-1111</span></p>
          <p class="c9"><span class="c2"></span></p><a id="t.d97173251f8e8de98f4d2ef9884eaa81e39c959c"></a><a id="t.0"></a>
          <table class="c11">
              <tbody>
                  <tr class="c7">
                      <td class="c1" colspan="1" rowspan="1">
                          <p class="c8"><span class="c0">Iams Dog Food 10 kg</span></p>
                          <p class="c3"><span
                                  class="c2">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                          </p>
                      </td>
                      <td class="c1" colspan="1" rowspan="1">
                          <p class="c4">
                              <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><span
                                  class="c0">5.99</span></p>
                          <p class="c3"><span
                                  class="c2">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                          </p>
                      </td>
                  </tr>
                  <tr class="c6">
                      <td class="c1" colspan="1" rowspan="1">
                          <p class="c8"><span class="c0">Iams Cat Food 1kg</span></p>
                          <p class="c3"><span
                                  class="c2">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                          </p>
                      </td>
                      <td class="c1" colspan="1" rowspan="1">
                          <p class="c4">
                              <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><span
                                  class="c0">2.99</span></p>
                          <p class="c3"><span
                                  class="c2">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                          </p>
                      </td>
                  </tr>
                  <tr class="c6">
                      <td class="c1" colspan="1" rowspan="1">
                          <p class="c8"><span class="c0">Organic Kitty Litter 5kg</span></p>
                          <p class="c3"><span
                                  class="c2">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                          </p>
                      </td>
                      <td class="c1" colspan="1" rowspan="1">
                          <p class="c4">
                              <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><span
                                  class="c0">2.99</span></p>
                          <p class="c3"><span
                                  class="c2">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                          </p>
                      </td>
                  </tr>
              </tbody>
          </table>
          <p class="c9"><span class="c2"></span></p>
          <p class="c12"><span class="c0">We also have a selection of toys, treats and other pet-cessities.</span></p>
          <p class="c3 c14"><span class="c2"></span></p>
      </body>
      
      </html>      `);
  
    }
}
