'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { RotateCcw, Zap, Heart, Star, Moon, Sun, Cloud, Music } from 'lucide-react';

const ICONS = [Zap, Heart, Star, Moon, Sun, Cloud, Music, RotateCcw];

interface Card {
    id: number;
    iconIndex: number;
    isFlipped: boolean;
    isMatched: boolean;
}

export default function Memory() {
    const [cards, setCards] = useState<Card[]>([]);
    const [flippedCards, setFlippedCards] = useState<number[]>([]);
    const [moves, setMoves] = useState(0);
    const [isWon, setIsWon] = useState(false);

    useEffect(() => {
        initializeGame();
    }, []);

    const initializeGame = () => {
        const gameIcons = [...ICONS.slice(0, 8), ...ICONS.slice(0, 8)];
        const shuffled = gameIcons
            .map((_, index) => ({ index, sort: Math.random() }))
            .sort((a, b) => a.sort - b.sort)
            .map((item, id) => ({
                id,
                iconIndex: item.index % 8,
                isFlipped: false,
                isMatched: false,
            }));

        setCards(shuffled);
        setFlippedCards([]);
        setMoves(0);
        setIsWon(false);
    };

    const handleCardClick = (id: number) => {
        if (flippedCards.length === 2 || cards[id].isFlipped || cards[id].isMatched) return;

        const newCards = [...cards];
        newCards[id].isFlipped = true;
        setCards(newCards);

        const newFlipped = [...flippedCards, id];
        setFlippedCards(newFlipped);

        if (newFlipped.length === 2) {
            setMoves(m => m + 1);
            checkForMatch(newFlipped, newCards);
        }
    };

    const checkForMatch = (currentFlipped: number[], currentCards: Card[]) => {
        const [first, second] = currentFlipped;
        if (currentCards[first].iconIndex === currentCards[second].iconIndex) {
            setTimeout(() => {
                const newCards = [...currentCards];
                newCards[first].isMatched = true;
                newCards[second].isMatched = true;
                setCards(newCards);
                setFlippedCards([]);

                if (newCards.every(c => c.isMatched)) {
                    setIsWon(true);
                }
            }, 500);
        } else {
            setTimeout(() => {
                const newCards = [...currentCards];
                newCards[first].isFlipped = false;
                newCards[second].isFlipped = false;
                setCards(newCards);
                setFlippedCards([]);
            }, 1000);
        }
    };

    return (
        <div className="flex flex-col items-center gap-8">
            <div className="flex justify-between w-full max-w-[400px] text-white">
                <div className="text-xl font-bold">Moves: {moves}</div>
                {isWon && <div className="text-xl font-bold text-[var(--neon-green)]">You Won!</div>}
            </div>

            <div className="grid grid-cols-4 gap-3 md:gap-4">
                {cards.map((card) => {
                    const Icon = ICONS[card.iconIndex];
                    return (
                        <motion.div
                            key={card.id}
                            className={`relative w-16 h-16 md:w-20 md:h-20 cursor-pointer perspective-1000`}
                            onClick={() => handleCardClick(card.id)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <motion.div
                                className={`w-full h-full rounded-xl transition-all duration-300 transform-style-3d ${card.isFlipped || card.isMatched ? 'rotate-y-180' : ''
                                    }`}
                                style={{ transformStyle: 'preserve-3d', transform: card.isFlipped || card.isMatched ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
                            >
                                {/* Front (Hidden) */}
                                <div className="absolute inset-0 bg-white/10 border-2 border-white/20 rounded-xl backface-hidden flex items-center justify-center">
                                    <span className="text-2xl text-white/20">?</span>
                                </div>

                                {/* Back (Revealed) */}
                                <div
                                    className="absolute inset-0 bg-[var(--neon-pink)]/20 border-2 border-[var(--neon-pink)] rounded-xl backface-hidden flex items-center justify-center"
                                    style={{ transform: 'rotateY(180deg)', backfaceVisibility: 'hidden' }}
                                >
                                    <Icon className="w-8 h-8 text-[var(--neon-pink)]" />
                                </div>
                            </motion.div>
                        </motion.div>
                    );
                })}
            </div>

            <button
                onClick={initializeGame}
                className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 rounded-full text-white transition-colors"
            >
                <RotateCcw className="w-4 h-4" />
                Restart
            </button>
        </div>
    );
}
