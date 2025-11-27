'use client';

import { useState, useEffect, useRef } from 'react';
import { Play, RotateCcw } from 'lucide-react';

const CANVAS_WIDTH = 400;
const CANVAS_HEIGHT = 500;
const PADDLE_WIDTH = 80;
const PADDLE_HEIGHT = 10;
const BALL_RADIUS = 6;
const BRICK_ROWS = 5;
const BRICK_COLS = 8;
const BRICK_HEIGHT = 20;
const BRICK_GAP = 5;
const BRICK_WIDTH = (CANVAS_WIDTH - (BRICK_COLS + 1) * BRICK_GAP) / BRICK_COLS;

export default function Breakout() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [gameOver, setGameOver] = useState(false);
    const [score, setScore] = useState(0);
    const [won, setWon] = useState(false);

    // Game State Refs
    const ballRef = useRef({ x: 200, y: 300, dx: 4, dy: -4 });
    const paddleRef = useRef({ x: 160 });
    const bricksRef = useRef<{ x: number, y: number, status: number }[]>([]);
    const reqRef = useRef<number>(0);

    const initBricks = () => {
        const bricks = [];
        for (let c = 0; c < BRICK_COLS; c++) {
            for (let r = 0; r < BRICK_ROWS; r++) {
                bricks.push({
                    x: c * (BRICK_WIDTH + BRICK_GAP) + BRICK_GAP,
                    y: r * (BRICK_HEIGHT + BRICK_GAP) + BRICK_GAP + 30,
                    status: 1
                });
            }
        }
        bricksRef.current = bricks;
    };

    const resetGame = () => {
        ballRef.current = { x: 200, y: 300, dx: 4, dy: -4 };
        paddleRef.current = { x: CANVAS_WIDTH / 2 - PADDLE_WIDTH / 2 };
        initBricks();
        setScore(0);
        setGameOver(false);
        setWon(false);
        setIsPlaying(true);
    };

    useEffect(() => {
        initBricks();

        const handleMouseMove = (e: MouseEvent) => {
            if (!canvasRef.current) return;
            const rect = canvasRef.current.getBoundingClientRect();
            const relativeX = e.clientX - rect.left;
            if (relativeX > 0 && relativeX < CANVAS_WIDTH) {
                paddleRef.current.x = relativeX - PADDLE_WIDTH / 2;
            }
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    useEffect(() => {
        if (!isPlaying) return;

        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!canvas || !ctx) return;

        const draw = () => {
            // Clear
            ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

            // Draw Bricks
            bricksRef.current.forEach(b => {
                if (b.status === 1) {
                    ctx.beginPath();
                    ctx.rect(b.x, b.y, BRICK_WIDTH, BRICK_HEIGHT);
                    ctx.fillStyle = '#ec4899'; // Neon Pink
                    ctx.fill();
                    ctx.closePath();
                }
            });

            // Draw Paddle
            ctx.beginPath();
            ctx.rect(paddleRef.current.x, CANVAS_HEIGHT - PADDLE_HEIGHT - 10, PADDLE_WIDTH, PADDLE_HEIGHT);
            ctx.fillStyle = '#00ffff'; // Neon Blue
            ctx.fill();
            ctx.closePath();

            // Draw Ball
            ctx.beginPath();
            ctx.arc(ballRef.current.x, ballRef.current.y, BALL_RADIUS, 0, Math.PI * 2);
            ctx.fillStyle = '#ffffff';
            ctx.fill();
            ctx.closePath();

            // Collision Logic
            const ball = ballRef.current;

            // Walls
            if (ball.x + ball.dx > CANVAS_WIDTH - BALL_RADIUS || ball.x + ball.dx < BALL_RADIUS) {
                ball.dx = -ball.dx;
            }
            if (ball.y + ball.dy < BALL_RADIUS) {
                ball.dy = -ball.dy;
            } else if (ball.y + ball.dy > CANVAS_HEIGHT - BALL_RADIUS) {
                // Paddle Collision
                if (ball.x > paddleRef.current.x && ball.x < paddleRef.current.x + PADDLE_WIDTH) {
                    ball.dy = -ball.dy;
                    // Add some spin/variation based on where it hit
                    const hitPoint = ball.x - (paddleRef.current.x + PADDLE_WIDTH / 2);
                    ball.dx = hitPoint * 0.15;
                } else {
                    setGameOver(true);
                    setIsPlaying(false);
                    return;
                }
            }

            // Brick Collision
            let activeBricks = 0;
            bricksRef.current.forEach(b => {
                if (b.status === 1) {
                    activeBricks++;
                    if (
                        ball.x > b.x &&
                        ball.x < b.x + BRICK_WIDTH &&
                        ball.y > b.y &&
                        ball.y < b.y + BRICK_HEIGHT
                    ) {
                        ball.dy = -ball.dy;
                        b.status = 0;
                        setScore(s => s + 10);
                    }
                }
            });

            if (activeBricks === 0) {
                setWon(true);
                setIsPlaying(false);
                return;
            }

            // Move Ball
            ball.x += ball.dx;
            ball.y += ball.dy;

            reqRef.current = requestAnimationFrame(draw);
        };

        reqRef.current = requestAnimationFrame(draw);
        return () => cancelAnimationFrame(reqRef.current);
    }, [isPlaying]);

    return (
        <div className="flex flex-col items-center gap-6">
            <div className="text-2xl font-bold text-white">Score: {score}</div>

            <div className="relative">
                <canvas
                    ref={canvasRef}
                    width={CANVAS_WIDTH}
                    height={CANVAS_HEIGHT}
                    className="bg-black/50 border-2 border-[var(--neon-pink)] rounded-lg cursor-none"
                />

                {(!isPlaying || gameOver || won) && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/70">
                        <div className="text-center">
                            {won && <div className="text-3xl font-bold text-[var(--neon-green)] mb-4">You Won!</div>}
                            {gameOver && <div className="text-3xl font-bold text-red-500 mb-4">Game Over</div>}
                            <button
                                onClick={resetGame}
                                className="flex items-center gap-2 px-8 py-4 bg-[var(--neon-pink)] text-white font-bold rounded-full hover:bg-white hover:text-[var(--neon-pink)] transition-colors"
                            >
                                {gameOver || won ? <RotateCcw className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                                {gameOver || won ? 'Play Again' : 'Start Game'}
                            </button>
                            <p className="text-gray-400 mt-4">Move mouse to control paddle</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
