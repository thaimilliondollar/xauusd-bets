import React, { useState, useEffect } from 'react';

function App() {
  const [direction, setDirection] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [price, setPrice] = useState(null);
  const [result, setResult] = useState('');
  const [score, setScore] = useState(0);

  useEffect(() => {
    fetchPrice();
  }, []);

  useEffect(() => {
    if (timeLeft === 0 && direction !== null) {
      fetchPrice().then((newPrice) => {
        const correct = (direction === 'up' && newPrice > price) || (direction === 'down' && newPrice < price);
        setResult(correct ? '✅ ทายถูก!' : '❌ ทายผิด');
        setScore(score + (correct ? 1 : -1));
        setDirection(null);
      });
    }
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 100);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  const fetchPrice = async () => {
  try {
    const res = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=tether-gold&vs_currencies=usd');
    const data = await res.json();
    const goldPrice = data['tether-gold'].usd;
    setPrice(goldPrice);
    return goldPrice;
  } catch (err) {
    console.error('API Error:', err);
    setResult('⚠️ ดึงราคาทองไม่สำเร็จ');
    return price;
  }
};


  const handleGuess = (guess) => {
    setDirection(guess);
    setTimeLeft(60);
    setResult('');
    fetchPrice();
  };

  return (
    <div style={{ padding: 20, fontFamily: 'Arial' }}>
      <h1>🎯 ทายราคาทองคำใน 1 นาที</h1>
      <h2>📉 ราคา: {price ?? 'กำลังโหลด...'}</h2>
      <button onClick={() => handleGuess('up')} disabled={timeLeft > 0}>⬆️ ขึ้น</button>
      <button onClick={() => handleGuess('down')} disabled={timeLeft > 0} style={{ marginLeft: 10 }}>⬇️ ลง</button>
      {timeLeft > 0 && <p>⏳ เหลือเวลา: {timeLeft} วินาที</p>}
      {result && <p>{result}</p>}
      <p>🏆 คะแนนของคุณ: {score}</p>
    </div>
  );
}

export default App;
