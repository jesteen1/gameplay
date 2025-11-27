'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { RotateCcw, User, Bot, Brain, Sparkles } from 'lucide-react';

type Player = 'X' | 'O' | null;
type GameMode = 'pvp' | 'pvc';
type Difficulty = 'easy' | 'hard';

export default function TicTacToe() {
    const [board, setBoard] = useState<Player[]>(Array(9).fill(null));
    const [xIsNext, setXIsNext] = useState(true);
    const [gameMode, setGameMode] = useState<GameMode>('pvp');
    const [difficulty, setDifficulty] = useState<Difficulty>('easy');
    const [isThinking, setIsThinking] = useState(false);

    const winner = calculateWinner(board);
    const isDraw = !winner && board.every(Boolean);

    const handleClick = useCallback((i: number) => {
        if (winner || board[i] || (gameMode === 'pvc' && !xIsNext && !winner)) return;

        const newBoard = [...board];
        newBoard[i] = xIsNext ? 'X' : 'O';
        setBoard(newBoard);
        setXIsNext(!xIsNext);
    }, [board, winner, xIsNext, gameMode]);

    const resetGame = () => {
        setBoard(Array(9).fill(null));
        setXIsNext(true);
        setIsThinking(false);
    };

    // AI Turn
    useEffect(() => {
        if (gameMode === 'pvc' && !xIsNext && !winner && !isDraw) {
            setIsThinking(true);
            const timer = setTimeout(() => {
                const bestMove = getBestMove(board, difficulty);
                if (bestMove !== -1) {
                    const newBoard = [...board];
                    newBoard[bestMove] = 'O';
                    setBoard(newBoard);
                    setXIsNext(true);
                }
                setIsThinking(false);
            }, 600); // Delay for realism
            return () => clearTimeout(timer);
        }
    }, [xIsNext, gameMode, winner, isDraw, board, difficulty]);

    let status;
    if (winner) {
        if (gameMode === 'pvc') {
            status = winner === 'X' ? 'You Win!' : 'You Lose!';
        } else {
            status = `Winner: ${winner}`;
        }
    } else if (isDraw) {
        status = "Draw!";
    } else {
        status = `Next player: ${xIsNext ? 'X' : 'O'}`;
    }

    return (
        <div className="flex flex-col items-center gap-6">
            <div className="flex flex-col gap-4 items-center">
                {/* Game Mode Toggle */}
                <div className="flex bg-white/5 p-1 rounded-full border border-white/10">
                    <button
                        onClick={() => { setGameMode('pvp'); resetGame(); }}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${gameMode === 'pvp' ? 'bg-[var(--neon-blue)] text-black font-bold' : 'text-gray-400 hover:text-white'
                            }`}
                    >
                        <User className="w-4 h-4" /> PvP
                    </button>
                    <button
                        onClick={() => { setGameMode('pvc'); resetGame(); }}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${gameMode === 'pvc' ? 'bg-[var(--neon-purple)] text-white font-bold' : 'text-gray-400 hover:text-white'
                            }`}
                    >
                        <Bot className="w-4 h-4" /> PvC
                    </button>
                </div>

                {/* Difficulty Toggle (Only for PvC) */}
                {gameMode === 'pvc' && (
                    <div className="flex bg-white/5 p-1 rounded-full border border-white/10 scale-90">
                        <button
                            onClick={() => { setDifficulty('easy'); resetGame(); }}
                            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${difficulty === 'easy' ? 'bg-[var(--neon-green)] text-black font-bold' : 'text-gray-400 hover:text-white'
                                }`}
                        >
                            <Sparkles className="w-4 h-4" /> Easy
                        </button>
                        <button
                            onClick={() => { setDifficulty('hard'); resetGame(); }}
                            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${difficulty === 'hard' ? 'bg-[var(--neon-pink)] text-white font-bold' : 'text-gray-400 hover:text-white'
                                }`}
                        >
                            <Brain className="w-4 h-4" /> Hard
                        </button>
                    </div>
                )}
            </div>

            <div className="text-2xl font-bold text-[var(--neon-blue)] min-h-[32px]">
                {isThinking ? "Computer is thinking..." : status}
            </div>

            <div className="grid grid-cols-3 gap-2">
                {board.map((cell, i) => (
                    <motion.button
                        key={i}
                        className={`w-20 h-20 md:w-24 md:h-24 bg-white/5 border-2 border-white/10 rounded-xl text-4xl font-bold flex items-center justify-center hover:bg-white/10 transition-colors
              ${cell === 'X' ? 'text-[var(--neon-pink)]' : 'text-[var(--neon-green)]'}
            `}
                        onClick={() => handleClick(i)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        disabled={!!cell || !!winner || (gameMode === 'pvc' && !xIsNext)}
                    >
                        {cell && (
                            <motion.span
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring" }}
                            >
                                {cell}
                            </motion.span>
                        )}
                    </motion.button>
                ))}
            </div>

            <button
                onClick={resetGame}
                className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 rounded-full text-white transition-colors"
            >
                <RotateCcw className="w-4 h-4" />
                Reset Game
            </button>
        </div>
    );
}

function calculateWinner(squares: Player[]) {
    const lines = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        }
    }
    return null;
}

// AI Logic
function getBestMove(board: Player[], difficulty: Difficulty): number {
    // Easy: Random Move
    if (difficulty === 'easy') {
        const availableMoves = board.map((cell, i) => cell === null ? i : null).filter(i => i !== null) as number[];
        if (availableMoves.length === 0) return -1;
        return availableMoves[Math.floor(Math.random() * availableMoves.length)];
    }

    // Hard: Minimax
    let bestScore = -Infinity;
    let move = -1;

    for (let i = 0; i < 9; i++) {
        if (!board[i]) {
            board[i] = 'O';
            const score = minimax(board, 0, false);
            board[i] = null;
            if (score > bestScore) {
                bestScore = score;
                move = i;
            }
        }
    }
    return move;
}

const scores = {
    O: 10,
    X: -10,
    TIE: 0
};

function minimax(board: Player[], depth: number, isMaximizing: boolean): number {
    const result = calculateWinner(board);
    if (result !== null) {
        return scores[result as keyof typeof scores];
    }
    if (board.every(Boolean)) {
        return scores.TIE;
    }

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < 9; i++) {
            if (!board[i]) {
                board[i] = 'O';
                const score = minimax(board, depth + 1, false);
                board[i] = null;
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < 9; i++) {
            if (!board[i]) {
                board[i] = 'X';
                const score = minimax(board, depth + 1, true);
                board[i] = null;
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
}
