export interface Game {
    id: string;
    title: string;
    description: string;
    color: string;
}

export const games: Game[] = [
    { id: 'tictactoe', title: 'Tic Tac Toe', description: 'Classic X and O strategy game.', color: 'var(--neon-blue)' },
    { id: 'snake', title: 'Snake Game', description: 'Eat apples and grow longer!', color: 'var(--neon-green)' },
    { id: 'memory', title: 'Memory Card Match', description: 'Test your memory skills.', color: 'var(--neon-pink)' },
    { id: 'rps', title: 'Rock Paper Scissors', description: 'Beat the computer.', color: 'var(--neon-purple)' },
    { id: 'flappy', title: 'Flappy Bird Clone', description: 'Fly through the pipes.', color: '#facc15' },
    { id: 'racing', title: 'Car Racing', description: 'Dodge traffic and speed up.', color: '#ef4444' },
    { id: 'target', title: 'Shooting Target', description: 'Hit the moving targets.', color: '#f97316' },
    { id: 'guess', title: 'Number Guessing', description: 'Find the secret number.', color: '#06b6d4' },
    { id: 'maze', title: 'Maze Escape', description: 'Find your way out.', color: '#8b5cf6' },
    { id: 'breakout', title: 'Breakout', description: 'Smash all the bricks.', color: '#ec4899' },
];
