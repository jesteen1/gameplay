'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { games } from '@/data/games';
import { ArrowLeft, Play } from 'lucide-react';

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
};

export default function GamesPage() {
    return (
        <main className="min-h-screen p-8 md:p-20 bg-background relative">
            <div className="max-w-7xl mx-auto">
                <header className="mb-12 flex items-center gap-4">
                    <Link href="/" className="p-2 rounded-full hover:bg-white/10 transition-colors">
                        <ArrowLeft className="w-6 h-6 text-white" />
                    </Link>
                    <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[var(--neon-blue)] to-[var(--neon-pink)]">
                        Choose Your Game
                    </h1>
                </header>

                <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    variants={container}
                    initial="hidden"
                    animate="show"
                >
                    {games.map((game) => (
                        <motion.div key={game.id} variants={item}>
                            <Link href={`/games/${game.id}`} className="block h-full">
                                <div
                                    className="group h-full p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-[var(--neon-blue)] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(0,255,255,0.2)] flex flex-col justify-between"
                                    style={{ borderColor: `color-mix(in srgb, ${game.color} 30%, transparent)` }}
                                >
                                    <div>
                                        <div className="w-12 h-12 rounded-full mb-4 flex items-center justify-center" style={{ background: `${game.color}20`, color: game.color }}>
                                            <Play className="w-6 h-6 fill-current" />
                                        </div>
                                        <h2 className="text-2xl font-bold mb-2 text-white group-hover:text-[var(--neon-blue)] transition-colors">{game.title}</h2>
                                        <p className="text-gray-400">{game.description}</p>
                                    </div>
                                    <div className="mt-6 flex items-center text-sm font-medium" style={{ color: game.color }}>
                                        Play Now <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </main>
    );
}
