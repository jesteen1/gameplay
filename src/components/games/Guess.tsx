'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { RotateCcw, Send } from 'lucide-react';

export default function Guess() {
    const [target, setTarget] = useState(0);
    const [guess, setGuess] = useState('');
    const [message, setMessage] = useState('Guess a number between 1 and 100');
    const [attempts, setAttempts] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [history, setHistory] = useState<{ val: number; msg: string }[]>([]);

    useEffect(() => {
        resetGame();
    }, []);

    const resetGame = () => {
        setTarget(Math.floor(Math.random() * 100) + 1);
        setGuess('');
        setMessage('Guess a number between 1 and 100');
        setAttempts(0);
        setGameOver(false);
        setHistory([]);
    };

    const handleGuess = (e: React.FormEvent) => {
        e.preventDefault();
        const num = parseInt(guess);
        if (isNaN(num)) return;

        setAttempts(a => a + 1);
        let msg = '';

        if (num === target) {
            msg = 'Correct! You found it!';
            setGameOver(true);
        } else if (num < target) {
            msg = 'Too Low!';
        } else {
            msg = 'Too High!';
        }

        setMessage(msg);
        setHistory(prev => [{ val: num, msg }, ...prev]);
        setGuess('');
    };

    return (
        <div className="flex flex-col items-center gap-8 w-full max-w-md">
            <div className="text-center">
                <motion.div
                    key={message}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className={`text-2xl font-bold mb-2 ${gameOver ? 'text-[var(--neon-green)]' : 'text-[var(--neon-blue)]'}`}
                >
                    {message}
                </motion.div>
                <div className="text-gray-400">Attempts: {attempts}</div>
            </div>

            {!gameOver ? (
                <form onSubmit={handleGuess} className="flex gap-4 w-full">
                    <input
                        type="number"
                        value={guess}
                        onChange={(e) => setGuess(e.target.value)}
                        className="flex-1 bg-white/5 border border-white/20 rounded-xl px-6 py-4 text-2xl text-center text-white focus:outline-none focus:border-[var(--neon-blue)] transition-colors"
                        placeholder="?"
                        autoFocus
                    />
                    <button
                        type="submit"
                        className="bg-[var(--neon-blue)] text-black p-4 rounded-xl hover:bg-white transition-colors"
                    >
                        <Send className="w-6 h-6" />
                    </button>
                </form>
            ) : (
                <button
                    onClick={resetGame}
                    className="flex items-center gap-2 px-8 py-4 bg-[var(--neon-green)] text-black font-bold rounded-full hover:bg-white transition-colors"
                >
                    <RotateCcw className="w-5 h-5" />
                    Play Again
                </button>
            )}

            <div className="w-full max-h-60 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                {history.map((item, i) => (
                    <motion.div
                        key={i}
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        className="flex justify-between p-3 rounded-lg bg-white/5 border border-white/10"
                    >
                        <span className="font-bold text-white">{item.val}</span>
                        <span className={`${item.msg.includes('High') ? 'text-red-400' : item.msg.includes('Low') ? 'text-blue-400' : 'text-green-400'}`}>
                            {item.msg}
                        </span>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
