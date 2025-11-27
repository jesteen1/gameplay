'use client';

import { useState, useEffect, useRef } from 'react';
import { Play, RotateCcw } from 'lucide-react';

const GRAVITY = 0.6;
const JUMP_STRENGTH = -8;
const PIPE_SPEED = 3;
const PIPE_SPAWN_RATE = 1500;
const GAP_SIZE = 150;

export default function FlappyBird() {
    const [isPlaying, setIsPlaying] = useState(false);
    const [gameOver, setGameOver] = useState(false);
    const [score, setScore] = useState(0);
    const [birdPos, setBirdPos] = useState(250);
    const [birdVelocity, setBirdVelocity] = useState(0);
    const [pipes, setPipes] = useState<{ x: number; height: number; passed: boolean }[]>([]);

    const gameLoopRef = useRef<number>(0);
    const lastPipeTimeRef = useRef<number>(0);
    const containerRef = useRef<HTMLDivElement>(null);

    const resetGame = () => {
        setIsPlaying(true);
        setGameOver(false);
        setScore(0);
        setBirdPos(250);
        setBirdVelocity(0);
        setPipes([]);
        lastPipeTimeRef.current = Date.now();
    };

    const jump = () => {
        if (!isPlaying) return;
        setBirdVelocity(JUMP_STRENGTH);
    };

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.code === 'Space') {
                if (!isPlaying && !gameOver) resetGame();
                else jump();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isPlaying, gameOver]);

    useEffect(() => {
        if (!isPlaying || gameOver) {
            cancelAnimationFrame(gameLoopRef.current);
            return;
        }

        const loop = () => {
            const now = Date.now();

            // Update Bird
            setBirdPos((pos) => {
                const newPos = pos + birdVelocity;
                if (newPos > 500 || newPos < 0) { // Floor/Ceiling collision
                    setGameOver(true);
                    return pos;
                }
                return newPos;
            });
            setBirdVelocity((v) => v + GRAVITY);

            // Spawn Pipes
            if (now - lastPipeTimeRef.current > PIPE_SPAWN_RATE) {
                setPipes((prev) => [
                    ...prev,
                    { x: 400, height: Math.random() * (300 - 50) + 50, passed: false },
                ]);
                lastPipeTimeRef.current = now;
            }

            // Update Pipes
            setPipes((prev) => {
                return prev
                    .map((pipe) => ({ ...pipe, x: pipe.x - PIPE_SPEED }))
                    .filter((pipe) => pipe.x > -50);
            });

            // Collision Detection & Score
            setPipes((currentPipes) => {
                currentPipes.forEach((pipe) => {
                    // Check collision
                    const birdLeft = 50;
                    const birdRight = 80; // 30px width
                    const birdTop = birdPos;
                    const birdBottom = birdPos + 30; // 30px height

                    const pipeLeft = pipe.x;
                    const pipeRight = pipe.x + 50; // 50px width
                    const topPipeBottom = pipe.height;
                    const bottomPipeTop = pipe.height + GAP_SIZE;

                    if (
                        birdRight > pipeLeft &&
                        birdLeft < pipeRight &&
                        (birdTop < topPipeBottom || birdBottom > bottomPipeTop)
                    ) {
                        setGameOver(true);
                    }

                    // Update Score
                    if (!pipe.passed && birdLeft > pipeRight) {
                        pipe.passed = true;
                        setScore((s) => s + 1);
                    }
                });
                return currentPipes;
            });

            gameLoopRef.current = requestAnimationFrame(loop);
        };

        gameLoopRef.current = requestAnimationFrame(loop);

        return () => cancelAnimationFrame(gameLoopRef.current);
    }, [isPlaying, gameOver, birdVelocity, birdPos]);

    return (
        <div className="flex flex-col items-center gap-6">
            <div className="text-2xl font-bold text-white">Score: {score}</div>

            <div
                ref={containerRef}
                className="relative w-[400px] h-[500px] bg-black/50 border-2 border-[var(--neon-blue)] rounded-xl overflow-hidden cursor-pointer"
                onClick={jump}
            >
                {/* Bird */}
                <div
                    className="absolute w-[30px] h-[30px] bg-yellow-400 rounded-full border-2 border-white"
                    style={{ top: birdPos, left: 50, transform: `rotate(${birdVelocity * 3}deg)` }}
                />

                {/* Pipes */}
                {pipes.map((pipe, i) => (
                    <div key={i}>
                        {/* Top Pipe */}
                        <div
                            className="absolute bg-green-500 border-2 border-green-300 w-[50px]"
                            style={{ left: pipe.x, top: 0, height: pipe.height }}
                        />
                        {/* Bottom Pipe */}
                        <div
                            className="absolute bg-green-500 border-2 border-green-300 w-[50px]"
                            style={{ left: pipe.x, top: pipe.height + GAP_SIZE, bottom: 0 }}
                        />
                    </div>
                ))}

                {(!isPlaying || gameOver) && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/70">
                        <div className="text-center">
                            {gameOver && <div className="text-3xl font-bold text-red-500 mb-4">Game Over</div>}
                            <button
                                onClick={(e) => { e.stopPropagation(); resetGame(); }}
                                className="flex items-center gap-2 px-8 py-4 bg-[var(--neon-blue)] text-black font-bold rounded-full hover:bg-white transition-colors"
                            >
                                {gameOver ? <RotateCcw className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                                {gameOver ? 'Try Again' : 'Start Game'}
                            </button>
                            <p className="text-gray-400 mt-4">Press Space or Click to Jump</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
