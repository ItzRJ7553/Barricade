import { useState } from 'react';
import './App.css';

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-8">Barricade</h1>
        <p className="text-xl text-slate-300 mb-8">A game where two players block each other and race to the opposite side</p>
        <button
          onClick={() => setCount(count + 1)}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition"
        >
          Start Game
        </button>
      </div>
    </div>
  );
}

export default App;
