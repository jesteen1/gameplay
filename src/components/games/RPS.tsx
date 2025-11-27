'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Hand, Scissors, Scroll, RotateCcw } from 'lucide-react';

const CHOICES = [
    { id: 'rock', icon: Hand, label: 'Rock', beats: 'scissors' },
    { id: 'paper', icon: Scroll, label: 'Paper', beats: 'rock' },
    { id: 'scissors', icon: Scissors, label: 'Scissors', beats: 'paper' },
];

export default function RPS() {
    const [playerChoice, setPlayerChoice] = useState<string | null>(null);
    const [computerChoice, setComputerChoice] = useState<string | null>(null);
    const [result, setResult] = useState<string | null>(null);
    const [score, setScore] = useState({ player: 0, computer: 0 });

    const handleChoice = (choiceId: string) => {
        const computer = CHOICES[Math.floor(Math.random() * CHOICES.length)].id;
        setPlayerChoice(choiceId);
        setComputerChoice(computer);
        determineWinner(choiceId, computer);
    };

    const determineWinner = (player: string, computer: string) => {
        if (player === computer) {
            setResult("It's a Draw!");
        } else {
            const choice = CHOICES.find(c => c.id === player);
            if (choice?.beats === computer) {
                setResult("You Win!");
                setScore(s => ({ ...s, player: s.player + 1 }));
            } else {
                setResult("Computer Wins!");
                setScore(s => ({ ...s, computer: s.computer + 1 }));
            }
        }
    };

    const resetRound = () => {
        setPlayerChoice(null);
        setComputerChoice(null);
        setResult(null);
    };

    return (
        <div className="flex flex-col items-center gap-12 w-full max-w-2xl">
            <div className="flex justify-between w-full text-white text-xl font-bold px-8">
                <div className="text-[var(--neon-blue)]">You: {score.player}</div>
                <div className="text-[var(--neon-pink)]">CPU: {score.computer}</div>
            </div>

            <div className="h-64 flex items-center justify-center w-full">
                <AnimatePresence mode="wait">
                    {!playerChoice ? (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="text-2xl text-gray-400"
                        >
                            Choose your weapon!
                        </motion.div>
                    ) : (
                        <div className="flex items-center gap-8 md:gap-20">
                            <ChoiceDisplay id={playerChoice} label="You" color="var(--neon-blue)" />
                            <div className="text-2xl font-bold text-white">VS</div>
                            <ChoiceDisplay id={computerChoice!} label="CPU" color="var(--neon-pink)" />
                        </div>
                    )}
                </AnimatePresence>
            </div>

            {result && (
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="text-4xl font-bold text-white mb-4"
                >
                    {result}
                </motion.div>
            )}

            {!playerChoice ? (
                <div className="flex gap-4 md:gap-8">
                    {CHOICES.map((choice) => (
                        <motion.button
                            key={choice.id}
                            onClick={() => handleChoice(choice.id)}
                            className="p-6 rounded-2xl bg-white/5 border-2 border-white/10 hover:border-[var(--neon-blue)] hover:bg-[var(--neon-blue)]/10 transition-all flex flex-col items-center gap-2"
                            whileHover={{ scale: 1.1, y: -5 }}
                            whileTap={{ scale: 0.9 }}
                        >
                            <choice.icon className="w-12 h-12 text-white" />
                            <span className="text-sm font-bold text-gray-300">{choice.label}</span>
                        </motion.button>
                    ))}
                </div>
            ) : (
                <button
                    onClick={resetRound}
                    className="flex items-center gap-2 px-8 py-4 bg-[var(--neon-purple)] text-white font-bold rounded-full hover:bg-white hover:text-[var(--neon-purple)] transition-colors"
                >
                    <RotateCcw className="w-5 h-5" />
                    Play Again
                </button>
            )}
        </div>
    );
}

function ChoiceDisplay({ id, label, color }: { id: string, label: string, color: string }) {
    const choice = CHOICES.find(c => c.id === id);
    const Icon = choice?.icon || Hand;

    return (
        <motion.div
            className="flex flex-col items-center gap-4"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", bounce: 0.5 }}
        >
            <div
                className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 flex items-center justify-center bg-black/30"
                style={{ borderColor: color, boxShadow: `0 0 30px ${color}40` }}
            >
                <Icon className="w-12 h-12 md:w-16 md:h-16 text-white" />
            </div>
            <span className="text-xl font-bold" style={{ color }}>{label}</span>
        </motion.div>
    );
}
