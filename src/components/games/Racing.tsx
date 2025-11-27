'use client';

import { useState, useEffect, useRef } from 'react';
import { Play, RotateCcw, CarFront } from 'lucide-react';

const ROAD_WIDTH = 300;
const CAR_WIDTH = 40;
const CAR_HEIGHT = 70;
const INITIAL_SPEED = 5;

export default function Racing() {
    const [isPlaying, setIsPlaying] = useState(false);
    const [gameOver, setGameOver] = useState(false);
    const [score, setScore] = useState(0);
    const [playerX, setPlayerX] = useState(ROAD_WIDTH / 2 - CAR_WIDTH / 2);
    const [enemies, setEnemies] = useState<{ x: number; y: number; speed: number }[]>([]);
    const [speed, setSpeed] = useState(INITIAL_SPEED);

    const gameLoopRef = useRef<number>(0);
    const scoreRef = useRef(0);

    const resetGame = () => {
        setIsPlaying(true);
        setGameOver(false);
        setScore(0);
        scoreRef.current = 0;
        setPlayerX(ROAD_WIDTH / 2 - CAR_WIDTH / 2);
        setEnemies([]);
        setSpeed(INITIAL_SPEED);
    };

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!isPlaying || gameOver) return;
            if (e.key === 'ArrowLeft') setPlayerX(x => Math.max(0, x - 20));
            if (e.key === 'ArrowRight') setPlayerX(x => Math.min(ROAD_WIDTH - CAR_WIDTH, x + 20));
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
            // Spawn Enemies
            if (Math.random() < 0.02) {
                setEnemies(prev => [
                    ...prev,
                    {
                        x: Math.random() * (ROAD_WIDTH - CAR_WIDTH),
                        y: -100,
                        speed: speed + Math.random() * 2
                    }
                ]);
            }

            // Update Enemies
            setEnemies(prev => {
                const newEnemies = prev
                    .map(e => ({ ...e, y: e.y + e.speed }))
                    .filter(e => e.y < 600);

                // Collision Detection
                const playerRect = { x: playerX, y: 400, w: CAR_WIDTH, h: CAR_HEIGHT };

                for (const enemy of newEnemies) {
                    const enemyRect = { x: enemy.x, y: enemy.y, w: CAR_WIDTH, h: CAR_HEIGHT };
                    if (
                        playerRect.x < enemyRect.x + enemyRect.w &&
                        playerRect.x + playerRect.w > enemyRect.x &&
                        playerRect.y < enemyRect.y + enemyRect.h &&
                        playerRect.y + playerRect.h > enemyRect.y
                    ) {
                        setGameOver(true);
                    }
                }

                return newEnemies;
            });

            // Update Score
            scoreRef.current += 1;
            if (scoreRef.current % 100 === 0) {
                setScore(Math.floor(scoreRef.current / 10));
                setSpeed(s => Math.min(s + 0.1, 15));
            }

            gameLoopRef.current = requestAnimationFrame(loop);
        };

        gameLoopRef.current = requestAnimationFrame(loop);
        return () => cancelAnimationFrame(gameLoopRef.current);
    }, [isPlaying, gameOver, playerX, speed]);

    return (
        <div className="flex flex-col items-center gap-6">
            <div className="text-2xl font-bold text-white">Score: {score}</div>

            <div className="relative w-[300px] h-[500px] bg-gray-800 border-x-4 border-white overflow-hidden">
                {/* Road Markings */}
                <div className="absolute inset-0 flex justify-center">
                    <div className="w-2 h-full border-l-2 border-dashed border-white/50" />
                </div>

                {/* Player Car */}
                <div
                    className="absolute text-red-500 transition-all duration-75"
                    style={{ left: playerX, top: 400 }}
                >
                    <CarFront size={40} strokeWidth={2} className="w-[40px] h-[70px]" />
                </div>

                {/* Enemy Cars */}
                {enemies.map((enemy, i) => (
                    <div
                        key={i}
                        className="absolute text-blue-500"
                        style={{ left: enemy.x, top: enemy.y }}
                    >
                        <CarFront size={40} strokeWidth={2} className="w-[40px] h-[70px]" />
                    </div>
                ))}

                {(!isPlaying || gameOver) && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/70 z-10">
                        <div className="text-center">
                            {gameOver && <div className="text-3xl font-bold text-red-500 mb-4">CRASHED!</div>}
                            <button
                                onClick={resetGame}
                                className="flex items-center gap-2 px-8 py-4 bg-red-500 text-white font-bold rounded-full hover:bg-white hover:text-red-500 transition-colors"
                            >
                                {gameOver ? <RotateCcw className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                                {gameOver ? 'Try Again' : 'Start Engines'}
                            </button>
                            <p className="text-gray-400 mt-4">Use Left/Right Arrows</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
