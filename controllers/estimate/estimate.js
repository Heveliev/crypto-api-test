const axios = require("axios")

const {modelExchange} = require("../../models");


const estimate =  async (req, res) => {
    const {inputAmount, inputCurrency, outputCurrency} = req.query;


    const coinFunc = (inp,oup) => {
        if(inp !== "USDT" && oup !== "USDT") {
            return {fr:inp,sc:oup}
        }
        if(inp === "USDT") {
            return {fr:oup,sc:inp}
        }
        else return {fr:inp,sc:oup}
    }

    const {fr,sc} = coinFunc(inputCurrency,outputCurrency);

    axios.all(
        [
            axios.get(`${modelExchange.binance.url}?symbol=${fr}${sc}`),
            axios.get(`${modelExchange.kucoin.url}?symbol=${fr}-${sc}`)
        ]
    )
        .then(axios.spread((binance, kucoin) => {

            const bitPrice = binance.data[0].price;
            const kuPrice = kucoin.data.data.price;

            const betterExchange = bitPrice >= kuPrice;

            const exch = betterExchange ? "binance" : "kucoin";

            const amount = (price) => {
                if (inputCurrency === "USDT") {
                    return inputAmount / price;
                } else return price * inputAmount
            }

            const amountPrice = betterExchange ? amount(bitPrice) : amount(kuPrice);

            const result = {
                exchangeName: exch,
                outputAmount: amountPrice.toFixed(2),
            };

            res.json(result);
        }))
        .catch(error => {
            res.status(500).json({error: 'Exchange server error'});
        });

}

module.exports = estimate;