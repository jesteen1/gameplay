'use client';

import { useState, useEffect, useCallback } from 'react';
import { Play, RotateCcw } from 'lucide-react';

const GRID_SIZE = 20;
const CELL_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_DIRECTION = { x: 0, y: -1 };
const SPEED = 150;

export default function Snake() {
    const [snake, setSnake] = useState(INITIAL_SNAKE);
    const [food, setFood] = useState({ x: 15, y: 15 });
    const [direction, setDirection] = useState(INITIAL_DIRECTION);
    const [gameOver, setGameOver] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [score, setScore] = useState(0);

    const generateFood = useCallback(() => {
        return {
            x: Math.floor(Math.random() * GRID_SIZE),
            y: Math.floor(Math.random() * GRID_SIZE),
        };
    }, []);

    const resetGame = () => {
        setSnake(INITIAL_SNAKE);
        setDirection(INITIAL_DIRECTION);
        setGameOver(false);
        setIsPlaying(true);
        setScore(0);
        setFood(generateFood());
    };

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            switch (e.key) {
                case 'ArrowUp': if (direction.y === 0) setDirection({ x: 0, y: -1 }); break;
                case 'ArrowDown': if (direction.y === 0) setDirection({ x: 0, y: 1 }); break;
                case 'ArrowLeft': if (direction.x === 0) setDirection({ x: -1, y: 0 }); break;
                case 'ArrowRight': if (direction.x === 0) setDirection({ x: 1, y: 0 }); break;
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [direction]);

    useEffect(() => {
        if (!isPlaying || gameOver) return;

        const moveSnake = setInterval(() => {
            setSnake((prevSnake) => {
                const newHead = {
                    x: prevSnake[0].x + direction.x,
                    y: prevSnake[0].y + direction.y,
                };

                // Check collision with walls
                if (
                    newHead.x < 0 ||
                    newHead.x >= GRID_SIZE ||
                    newHead.y < 0 ||
                    newHead.y >= GRID_SIZE
                ) {
                    setGameOver(true);
                    return prevSnake;
                }

                // Check collision with self
                if (prevSnake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)) {
                    setGameOver(true);
                    return prevSnake;
                }

                const newSnake = [newHead, ...prevSnake];

                // Check food
                if (newHead.x === food.x && newHead.y === food.y) {
                    setScore((s) => s + 1);
                    setFood(generateFood());
                } else {
                    newSnake.pop();
                }

                return newSnake;
            });
        }, SPEED);

        return () => clearInterval(moveSnake);
    }, [isPlaying, gameOver, direction, food, generateFood]);

    return (
        <div className="flex flex-col items-center gap-6">
            <div className="flex justify-between w-full max-w-[400px] text-white">
                <div className="text-xl font-bold">Score: {score}</div>
                {gameOver && <div className="text-xl font-bold text-red-500">Game Over!</div>}
            </div>

            <div
                className="relative bg-black/50 border-2 border-[var(--neon-green)] rounded-lg overflow-hidden shadow-[0_0_20px_rgba(57,255,20,0.2)]"
                style={{ width: GRID_SIZE * CELL_SIZE, height: GRID_SIZE * CELL_SIZE }}
            >
                {snake.map((segment, i) => (
                    <div
                        key={i}
                        className="absolute bg-[var(--neon-green)] rounded-sm"
                        style={{
                            left: segment.x * CELL_SIZE,
                            top: segment.y * CELL_SIZE,
                            width: CELL_SIZE - 2,
                            height: CELL_SIZE - 2,
                            opacity: i === 0 ? 1 : 0.7,
                        }}
                    />
                ))}
                <div
                    className="absolute bg-[var(--neon-pink)] rounded-full animate-pulse"
                    style={{
                        left: food.x * CELL_SIZE,
                        top: food.y * CELL_SIZE,
                        width: CELL_SIZE - 2,
                        height: CELL_SIZE - 2,
                    }}
                />
            </div>

            <div className="flex gap-4">
                {!isPlaying || gameOver ? (
                    <button
                        onClick={resetGame}
                        className="flex items-center gap-2 px-6 py-3 bg-[var(--neon-green)] text-black font-bold rounded-full hover:bg-white transition-colors"
                    >
                        {gameOver ? <RotateCcw className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                        {gameOver ? 'Try Again' : 'Start Game'}
                    </button>
                ) : (
                    <div className="text-gray-400 text-sm">Use Arrow Keys to Move</div>
                )}
            </div>
        </div>
    );
}
