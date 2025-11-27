'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { games } from '@/data/games';
import ClientOnly from '@/components/ClientOnly';

// Game Imports
import TicTacToe from '@/components/games/TicTacToe';
import Snake from '@/components/games/Snake';
import Memory from '@/components/games/Memory';
import RPS from '@/components/games/RPS';
import FlappyBird from '@/components/games/FlappyBird';
import Racing from '@/components/games/Racing';
import Target from '@/components/games/Target';
import Guess from '@/components/games/Guess';
import Maze from '@/components/games/Maze';
import Breakout from '@/components/games/Breakout';

export default function GamePage() {
    const params = useParams();
    const id = params.id as string;
    const game = games.find(g => g.id === id);

    if (!game) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center text-white">
                <h1 className="text-2xl mb-4">Game not found</h1>
                <Link href="/games" className="text-[var(--neon-blue)] hover:underline">Back to Games</Link>
            </div>
        );
    }

    const renderGame = () => {
        switch (id) {
            case 'tictactoe': return <TicTacToe />;
            case 'snake': return <Snake />;
            case 'memory': return <Memory />;
            case 'rps': return <RPS />;
            case 'flappy': return <FlappyBird />;
            case 'racing': return <Racing />;
            case 'target': return <Target />;
            case 'guess': return <Guess />;
            case 'maze': return <Maze />;
            case 'breakout': return <Breakout />;
            default: return (
                <div className="text-center">
                    <p className="text-2xl text-gray-400 mb-4">Coming Soon!</p>
                    <p className="text-gray-500">We are working on {game.title}.</p>
                </div>
            );
        }
    };

    return (
        <main className="min-h-screen bg-background flex flex-col">
            <header className="p-6 flex items-center gap-4 border-b border-white/10 bg-black/50 backdrop-blur-md sticky top-0 z-50">
                <Link href="/games" className="p-2 rounded-full hover:bg-white/10 transition-colors">
                    <ArrowLeft className="w-6 h-6 text-white" />
                </Link>
                <h1 className="text-xl md:text-2xl font-bold text-white">{game.title}</h1>
            </header>

            <div className="flex-1 flex items-center justify-center p-4 md:p-8 overflow-hidden">
                <ClientOnly>
                    {renderGame()}
                </ClientOnly>
            </div>
        </main>
    );
}
