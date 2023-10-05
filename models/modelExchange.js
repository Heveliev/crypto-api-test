const modelExchange = {
    binance: {
        url: 'https://api.binance.com/api/v3/trades',
        pairs: {
            BTC: 'BTCUSDT',
            ETH: 'ETHUSDT',
        },
    },
    kucoin: {
        url: 'https://api.kucoin.com/api/v1/market/orderbook/level1',
        pairs: {
            BTC: 'BTC-USDT',
            ETH: 'ETH-USDT',
        },
    },
};

module.exports = modelExchange;