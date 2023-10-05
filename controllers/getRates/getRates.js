const axios = require("axios")

const {modelExchange} = require("../../models");


const getRates =  async (req, res) => {
    const {baseCurrency,quoteCurrency} = req.query;


    const coinFunc = (base,quo) => {
        if(base !== "BTC" && quo !== "BTC") {
            return {fr:base,sc:quo}
        }
        if(base === "BTC") {
            return {fr:quo,sc:base}
        }
        else return {fr:base,sc:quo}
    }

    const {fr,sc} = coinFunc(baseCurrency,quoteCurrency);
    console.log(fr,sc)

    axios.all(
        [
            axios.get(`${modelExchange.binance.url}?symbol=${fr}${sc}`),
            axios.get(`${modelExchange.kucoin.url}?symbol=${fr}-${sc}`)
        ]
    )
        .then(axios.spread((binance, kucoin) => {

            const bitPrice = binance.data[0].price;
            const kuPrice = kucoin.data.data.price;

            const amount = (price) => {
                if (baseCurrency === "BTC") {
                    return 1 / price;
                } else return price * 1
            }

            const amountPriceFr = amount(bitPrice) ;
            const amountPriceSc = amount(kuPrice);

            const result = [
                {
                    exchangeName:"binance",
                    rate:amountPriceFr,
                },
                {
                    exchangeName:"kucoin",
                    rate:amountPriceSc,
                }
            ]

            res.json(result);
        }))
        .catch(error => {
            res.status(500).json({error: 'Exchange server error'});
        });

}

module.exports = getRates;