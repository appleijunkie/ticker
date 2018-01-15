vueStocks = new Vue({
  el: "#vueStocks",
  data: {
    stocks: {
      "BTC": {},
      "LTC": {},
      "MOON": {},
      "LINX": {},
      "XRP": {},
      "XVG": {},
      "ETH": {},
      "BCH": {}
    }
  },
  methods: {
    updateStock: function(stock) {
      this.stocks[stock["symbol"]] = stock;
      setTimeout(() => {
        // Reset stock's isUp and isDown params to reset binded classes.
        // This will replay tick animation if price changes in the same direction.
        this.stocks[stock["symbol"]]["isUp"] = false;
        this.stocks[stock["symbol"]]["isDown"] = false;
        }, 1000);
      return null;
    },
  }
});


var stocks = [
    "BTC", "LTC", "MOON", "LINX",
    "XRP", "XVG", "ETH", "BCH"
];
var stocks = stocks.toString();
var url = "https://min-api.cryptocompare.com/data/pricemulti?fsyms="+ stocks +"&tsyms=USD";
var request = new XMLHttpRequest();
request.open("GET", url);
request.onload = function() {
    updateStocks(JSON.parse(request.response));
}
request.send(null);


function updateStocks(stocks) {
    for (key in stocks) {
        var stock = {
            "symbol": key,
            "closed": stocks[key]["USD"]
        }
        vueStocks.updateStock(stock);
    }
}


var coinIO = io.connect('https://streamer.cryptocompare.com/');
var subscriptions = [
  '5~CCCAGG~BTC~USD',
  '5~CCCAGG~LTC~USD',
  '5~CCCAGG~MOON~BTC',
  '5~CCCAGG~LINX~BTC',
  '5~CCCAGG~XRP~USD',
  '5~CCCAGG~XVG~USD',
  '5~CCCAGG~ETH~USD',
  '5~CCCAGG~BCH~USD',
];

coinIO.emit('SubAdd', {subs:subscriptions} );

coinIO.on("m", function(message){
    message = message.split("~");
    if (message[4] === "1" || message[4] === "2") {
        var stock = {
            "symbol": message[2],
            "closed": message[5]
        }
        if (message[4] === "1") {
            stock["isUp"] = true
        } else if (message[4] === "2") {
            stock["isDown"] = true
        }
        vueStocks.updateStock(stock);
    }
});

