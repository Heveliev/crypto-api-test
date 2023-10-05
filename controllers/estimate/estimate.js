const axios = require("axios")

const {modelExchange} = require("../../models");


const estimate =  async (req, res) => {
const  { inputAmount, inputCurrency, outputCurrency } = req.query;

const coinFunc = (inp) => {
    if(inp === "USDT") {
        return outputCurrency;
    }
    else return inputCurrency
}

axios.all(
    [
        axios.get(`${modelExchange.binance.url}?symbol=${coinFunc(inputCurrency)}USDT`),
        axios.get(`${modelExchange.kucoin.url}?symbol=${coinFunc(inputCurrency)}-USDT`)
    ]
)
    .then(axios.spread((binance, kucoin) => {

        const bitPrice = binance.data[0].price;
        const kuPrice = kucoin.data.data.price;

        const betterExchange = bitPrice >= kuPrice;

        const exch = betterExchange ? "binance" : "kucoin";

        const amount = (price) => {
            if(inputCurrency === "USDT"){
                return inputAmount/price;
            }
            else return price * inputAmount
        }

        const amountPrice =    betterExchange ?  amount(bitPrice) : amount(kuPrice);

        const result = {
            exchangeName: exch,
            outputAmount: amountPrice.toFixed(2),
        };

        res.json(result);
    }))
    .catch(error => {
        res.status(500).json({ error: 'Exchange server error' });
    });


};



module.exports = estimate;