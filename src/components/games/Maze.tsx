'use client';

import { useState, useEffect, useCallback } from 'react';
import { RotateCcw, Flag } from 'lucide-react';

const SIZE = 15;

export default function Maze() {
    const [maze, setMaze] = useState<number[][]>([]);
    const [player, setPlayer] = useState({ x: 0, y: 0 });
    const [goal, setGoal] = useState({ x: SIZE - 1, y: SIZE - 1 });
    const [won, setWon] = useState(false);

    const generateMaze = useCallback(() => {
        // Simple recursive backtracker or just random walls for simplicity in this demo
        // 0 = path, 1 = wall
        const newMaze = Array(SIZE).fill(0).map(() => Array(SIZE).fill(1));

        const stack = [{ x: 0, y: 0 }];
        newMaze[0][0] = 0;

        const dirs = [
            { x: 0, y: -2 }, { x: 0, y: 2 }, { x: -2, y: 0 }, { x: 2, y: 0 }
        ];

        function shuffle(array: any[]) {
            return array.sort(() => Math.random() - 0.5);
        }

        // DFS Maze Generation
        function carve(x: number, y: number) {
            const directions = shuffle([...dirs]);

            for (const dir of directions) {
                const nx = x + dir.x;
                const ny = y + dir.y;

                if (nx >= 0 && nx < SIZE && ny >= 0 && ny < SIZE && newMaze[ny][nx] === 1) {
                    newMaze[ny][nx] = 0;
                    newMaze[y + dir.y / 2][x + dir.x / 2] = 0;
                    carve(nx, ny);
                }
            }
        }

        carve(0, 0);

        // Ensure goal is reachable (it should be with DFS, but let's clear it just in case)
        newMaze[SIZE - 1][SIZE - 1] = 0;
        if (newMaze[SIZE - 2][SIZE - 1] === 1 && newMaze[SIZE - 1][SIZE - 2] === 1) {
            newMaze[SIZE - 2][SIZE - 1] = 0;
        }

        setMaze(newMaze);
        setPlayer({ x: 0, y: 0 });
        setGoal({ x: SIZE - 1, y: SIZE - 1 });
        setWon(false);
    }, []);

    useEffect(() => {
        generateMaze();
    }, [generateMaze]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (won) return;

            let dx = 0;
            let dy = 0;

            if (e.key === 'ArrowUp') dy = -1;
            if (e.key === 'ArrowDown') dy = 1;
            if (e.key === 'ArrowLeft') dx = -1;
            if (e.key === 'ArrowRight') dx = 1;

            if (dx === 0 && dy === 0) return;

            const nx = player.x + dx;
            const ny = player.y + dy;

            if (
                nx >= 0 && nx < SIZE &&
                ny >= 0 && ny < SIZE &&
                maze[ny][nx] === 0
            ) {
                setPlayer({ x: nx, y: ny });
                if (nx === goal.x && ny === goal.y) {
                    setWon(true);
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [player, maze, goal, won]);

    return (
        <div className="flex flex-col items-center gap-6">
            {won && <div className="text-2xl font-bold text-[var(--neon-green)]">You Escaped!</div>}

            <div
                className="grid bg-black border-2 border-[var(--neon-purple)] p-2 rounded-lg"
                style={{
                    gridTemplateColumns: `repeat(${SIZE}, 20px)`,
                    gap: '1px'
                }}
            >
                {maze.map((row, y) => (
                    row.map((cell, x) => {
                        const isPlayer = player.x === x && player.y === y;
                        const isGoal = goal.x === x && goal.y === y;

                        return (
                            <div
                                key={`${x}-${y}`}
                                className={`w-5 h-5 rounded-sm transition-colors duration-100
                  ${cell === 1 ? 'bg-gray-800' : 'bg-black'}
                  ${isPlayer ? 'bg-[var(--neon-blue)] shadow-[0_0_10px_var(--neon-blue)] z-10' : ''}
                  ${isGoal ? 'bg-[var(--neon-green)] animate-pulse' : ''}
                `}
                            >
                                {isGoal && !isPlayer && <Flag className="w-full h-full text-black p-0.5" />}
                            </div>
                        );
                    })
                ))}
            </div>

            <div className="flex gap-4">
                <button
                    onClick={generateMaze}
                    className="flex items-center gap-2 px-6 py-3 bg-[var(--neon-purple)] text-white font-bold rounded-full hover:bg-white hover:text-[var(--neon-purple)] transition-colors"
                >
                    <RotateCcw className="w-4 h-4" />
                    New Maze
                </button>
            </div>
            <p className="text-gray-400 text-sm">Use Arrow Keys to Move</p>
        </div>
    );
}
