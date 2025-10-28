import React, { useState, useEffect } from 'react';

function BTCPrediction() {
  const [currentPrice, setCurrentPrice] = useState(104696);
  const [prediction, setPrediction] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [priceHistory, setPriceHistory] = useState([]);
  const [timeLeft, setTimeLeft] = useState(3600);

  // CZ quotes for predictions
  const czQuotes = [
    "Bitcoin will reach new heights as institutional adoption accelerates.",
    "The fundamentals are stronger than ever. BTC is digital gold.",
    "Market cycles are natural. Long-term vision is what matters.",
    "Regulation brings clarity, and clarity brings confidence.",
    "The next bull run will surprise everyone with its magnitude.",
    "Bitcoin's scarcity will drive unprecedented price discovery.",
    "Global economic uncertainty makes Bitcoin more attractive.",
    "We're still early in the crypto revolution."
  ];

  // Generate realistic price prediction based on current trends
  const generatePrediction = () => {
    const basePrice = currentPrice;
    const volatility = 0.15; // 15% volatility range
    const trend = Math.random() > 0.4 ? 1 : -1; // 60% chance of upward trend
    const randomFactor = (Math.random() - 0.5) * volatility;
    const predictedPrice = basePrice * (1 + (trend * 0.05) + randomFactor);
    
    const timeframe = Math.random() > 0.5 ? "24 hours" : "next week";
    const confidence = Math.floor(Math.random() * 20) + 75; // 75-95% confidence
    const quote = czQuotes[Math.floor(Math.random() * czQuotes.length)];
    
    return {
      price: Math.round(predictedPrice),
      timeframe,
      confidence,
      quote,
      timestamp: new Date(),
      direction: predictedPrice > basePrice ? 'up' : 'down',
      change: ((predictedPrice - basePrice) / basePrice * 100).toFixed(2)
    };
  };

  // Fetch current BTC price
  const fetchBTCPrice = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        'https://ide-api.infinityg.ai/api/coingecko/coins/bitcoin?localization=false&tickers=false&market_data=true'
      );
      const data = await response.json();
      const price = data.market_data.current_price.usd;
      setCurrentPrice(price);
      
      // Add to price history
      setPriceHistory(prev => [...prev.slice(-23), { price, time: new Date() }]);
      
      // Generate new prediction
      const newPrediction = generatePrediction();
      setPrediction(newPrediction);
      setLastUpdate(new Date());
      setTimeLeft(3600); // Reset countdown
    } catch (error) {
      console.error('Error fetching BTC price:', error);
    } finally {
      setLoading(false);
    }
  };

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          fetchBTCPrice();
          return 3600;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Initial load
  useEffect(() => {
    fetchBTCPrice();
  }, []);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="min-h-screen p-4 md:p-8 relative overflow-hidden">
      {/* Floating Binance logos */}
      <div className="absolute top-20 left-10 w-16 h-16 opacity-20 animate-float">
        <div className="w-full h-full bg-binance rounded-full flex items-center justify-center text-black font-bold text-xl">B</div>
      </div>
      <div className="absolute bottom-32 right-16 w-12 h-12 opacity-15 animate-float" style={{animationDelay: '2s'}}>
        <div className="w-full h-full bg-binance rounded-full flex items-center justify-center text-black font-bold">₿</div>
      </div>
      <div className="absolute top-1/3 right-20 w-20 h-20 opacity-10 animate-float" style={{animationDelay: '4s'}}>
        <div className="w-full h-full bg-binance rounded-full flex items-center justify-center text-black font-bold text-2xl">CZ</div>
      </div>

      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-full h-full" 
             style={{
               backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23f3ba2f' fill-opacity='0.1'%3E%3Cpath d='M30 30l15-15v30l-15-15zm-15 0l-15 15v-30l15 15z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
               backgroundSize: '60px 60px'
             }}>
        </div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 animate-slide-up">
          <h1 className="text-6xl md:text-8xl font-bold mb-4 binance-gradient bg-clip-text text-transparent animate-pulse-glow">
            CZ predicting BTC price
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-2">
            Changpeng Zhao's AI-Powered Bitcoin Analysis
          </p>
          <div className="flex items-center justify-center gap-4 text-binance">
            <div className="w-2 h-2 bg-binance rounded-full animate-pulse"></div>
            <span className="text-sm">Live Predictions • Updated Hourly</span>
            <div className="w-2 h-2 bg-binance rounded-full animate-pulse"></div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Current Price Card */}
          <div className="binance-card rounded-2xl p-6 animate-slide-up">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-binance">Current BTC Price</h2>
              {loading && (
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-binance"></div>
              )}
            </div>
            <div className="text-4xl md:text-5xl font-bold mb-2">
              {formatPrice(currentPrice)}
            </div>
            <div className="text-sm text-gray-400 mb-4">
              Last updated: {lastUpdate.toLocaleTimeString()}
            </div>
            <div className="bg-gray-800 rounded-lg p-3">
              <div className="text-sm text-gray-400 mb-1">Next update in:</div>
              <div className="text-2xl font-mono text-binance">
                {formatTime(timeLeft)}
              </div>
            </div>
          </div>

          {/* CZ Prediction Card */}
          <div className="lg:col-span-2 binance-card rounded-2xl p-6 animate-slide-up" style={{animationDelay: '0.2s'}}>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-binance rounded-full flex items-center justify-center text-black font-bold text-xl">
                CZ
              </div>
              <div>
                <h2 className="text-2xl font-bold text-binance">CZ's Prediction</h2>
                <p className="text-gray-400">Powered by market analysis & intuition</p>
              </div>
            </div>

            {prediction && (
              <div className="space-y-6">
                {/* Prediction Quote */}
                <div className="bg-gray-800 rounded-lg p-4 border-l-4 border-binance">
                  <p className="text-lg italic text-gray-200">
                    "{prediction.quote}"
                  </p>
                </div>

                {/* Prediction Details */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gray-800 rounded-lg p-4 text-center">
                    <div className="text-sm text-gray-400 mb-1">Predicted Price</div>
                    <div className={`text-2xl font-bold ${prediction.direction === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                      {formatPrice(prediction.price)}
                    </div>
                    <div className={`text-sm ${prediction.direction === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                      {prediction.direction === 'up' ? '↗' : '↘'} {Math.abs(prediction.change)}%
                    </div>
                  </div>

                  <div className="bg-gray-800 rounded-lg p-4 text-center">
                    <div className="text-sm text-gray-400 mb-1">Timeframe</div>
                    <div className="text-xl font-bold text-binance">
                      {prediction.timeframe}
                    </div>
                  </div>

                  <div className="bg-gray-800 rounded-lg p-4 text-center">
                    <div className="text-sm text-gray-400 mb-1">Confidence</div>
                    <div className="text-xl font-bold text-binance">
                      {prediction.confidence}%
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                      <div 
                        className="bg-binance h-2 rounded-full transition-all duration-1000"
                        style={{width: `${prediction.confidence}%`}}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Prediction Timestamp */}
                <div className="text-center text-sm text-gray-400">
                  Prediction generated at {prediction.timestamp.toLocaleString()}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Price History Chart */}
        {priceHistory.length > 0 && (
          <div className="mt-8 binance-card rounded-2xl p-6 animate-slide-up" style={{animationDelay: '0.4s'}}>
            <h3 className="text-xl font-bold text-binance mb-4">24H Price Movement</h3>
            <div className="h-32 flex items-end justify-between gap-1">
              {priceHistory.map((point, index) => {
                const height = ((point.price - Math.min(...priceHistory.map(p => p.price))) / 
                              (Math.max(...priceHistory.map(p => p.price)) - Math.min(...priceHistory.map(p => p.price)))) * 100;
                return (
                  <div
                    key={index}
                    className="bg-binance rounded-t flex-1 transition-all duration-500 hover:bg-yellow-400"
                    style={{height: `${Math.max(height, 5)}%`}}
                    title={`${formatPrice(point.price)} at ${point.time.toLocaleTimeString()}`}
                  ></div>
                );
              })}
            </div>
            <div className="flex justify-between text-xs text-gray-400 mt-2">
              <span>24h ago</span>
              <span>Now</span>
            </div>
          </div>
        )}

        {/* Manual Update Button */}
        <div className="mt-8 text-center animate-slide-up" style={{animationDelay: '0.6s'}}>
          <button
            onClick={fetchBTCPrice}
            disabled={loading}
            className="bg-binance hover-binance text-black font-bold py-3 px-8 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
          >
            {loading ? 'Updating...' : 'Get New Prediction'}
          </button>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-gray-400 text-sm animate-slide-up" style={{animationDelay: '0.8s'}}>
          <p>⚠️ This is for entertainment purposes only. Not financial advice.</p>
          <p className="mt-2">Powered by CoinGecko API • Built with React</p>
        </div>
      </div>
    </div>
  );
}

window.BTCPrediction = BTCPrediction;