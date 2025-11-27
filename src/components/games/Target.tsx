'use client';

import { useState, useEffect, useRef } from 'react';
import { Play, RotateCcw, Crosshair, Target as TargetIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface TargetObj {
    id: number;
    x: number;
    y: number;
    size: number;
}

export default function Target() {
    const [isPlaying, setIsPlaying] = useState(false);
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(30);
    const [targets, setTargets] = useState<TargetObj[]>([]);

    const containerRef = useRef<HTMLDivElement>(null);

    const startGame = () => {
        setIsPlaying(true);
        setScore(0);
        setTimeLeft(30);
        setTargets([]);
    };

    useEffect(() => {
        if (!isPlaying) return;

        const timer = setInterval(() => {
            setTimeLeft(t => {
                if (t <= 1) {
                    setIsPlaying(false);
                    return 0;
                }
                return t - 1;
            });
        }, 1000);

        const spawner = setInterval(() => {
            if (targets.length < 5) {
                const id = Date.now();
                const size = Math.random() * 40 + 30; // 30-70px
                const x = Math.random() * (containerRef.current?.clientWidth || 300 - size);
                const y = Math.random() * (containerRef.current?.clientHeight || 300 - size);

                setTargets(prev => [...prev, { id, x, y, size }]);

                // Auto remove after 2s
                setTimeout(() => {
                    setTargets(prev => prev.filter(t => t.id !== id));
                }, 2000);
            }
        }, 600);

        return () => {
            clearInterval(timer);
            clearInterval(spawner);
        };
    }, [isPlaying, targets.length]);

    const handleShoot = (id: number) => {
        setScore(s => s + 10);
        setTargets(prev => prev.filter(t => t.id !== id));
    };

    return (
        <div className="flex flex-col items-center gap-6 w-full max-w-2xl">
            <div className="flex justify-between w-full text-white text-xl font-bold px-4">
                <div>Score: {score}</div>
                <div className={`${timeLeft < 10 ? 'text-red-500' : 'text-white'}`}>Time: {timeLeft}s</div>
            </div>

            <div
                ref={containerRef}
                className="relative w-full h-[400px] bg-gray-900 border-2 border-[var(--neon-blue)] rounded-xl overflow-hidden cursor-crosshair"
            >
                <AnimatePresence>
                    {targets.map(target => (
                        <motion.div
                            key={target.id}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                            className="absolute flex items-center justify-center text-[var(--neon-pink)] hover:text-white transition-colors"
                            style={{
                                left: target.x,
                                top: target.y,
                                width: target.size,
                                height: target.size
                            }}
                            onMouseDown={() => handleShoot(target.id)}
                        >
                            <TargetIcon className="w-full h-full" />
                        </motion.div>
                    ))}
                </AnimatePresence>

                {!isPlaying && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/70 z-10">
                        <div className="text-center">
                            {timeLeft === 0 && <div className="text-3xl font-bold text-[var(--neon-green)] mb-4">Final Score: {score}</div>}
                            <button
                                onClick={startGame}
                                className="flex items-center gap-2 px-8 py-4 bg-[var(--neon-blue)] text-black font-bold rounded-full hover:bg-white transition-colors"
                            >
                                {timeLeft === 0 ? <RotateCcw className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                                {timeLeft === 0 ? 'Play Again' : 'Start Shooting'}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
