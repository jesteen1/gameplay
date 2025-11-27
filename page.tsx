'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import BackgroundAnimation from '@/components/BackgroundAnimation';
import { Gamepad2, Sparkles, Zap } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center relative overflow-hidden">
      <BackgroundAnimation />

      {/* Hero Section */}
      <section className="min-h-screen flex flex-col items-center justify-center text-center px-4 z-10 w-full">
        <motion.h1
          className="text-6xl md:text-9xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-[var(--neon-blue)] via-[var(--neon-purple)] to-[var(--neon-pink)] drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          PlayWorld
        </motion.h1>

        <motion.p
          className="text-xl md:text-3xl text-gray-300 mb-12 max-w-2xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
        >
          A playground under one sky.
          <br />
          <span className="text-sm md:text-lg opacity-80 block mt-4">Fast. Light. Beautiful.</span>
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1, duration: 0.5, type: "spring" }}
        >
          <Link
            href="/games"
            className="group relative inline-flex items-center gap-3 px-8 py-4 bg-transparent border-2 border-[var(--neon-green)] text-[var(--neon-green)] rounded-full text-xl font-bold overflow-hidden transition-all hover:bg-[var(--neon-green)] hover:text-black hover:shadow-[0_0_20px_var(--neon-green)]"
          >
            <Gamepad2 className="w-6 h-6" />
            <span>Start Playing</span>
          </Link>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="min-h-[50vh] w-full flex flex-col md:flex-row items-center justify-center gap-10 p-10 z-10 max-w-7xl mx-auto">
        <FeatureCard
          icon={<Zap className="w-10 h-10 text-[var(--neon-blue)]" />}
          title="Instant Play"
          desc="No downloads. No waiting. Just click and play."
          delay={0.2}
        />
        <FeatureCard
          icon={<Sparkles className="w-10 h-10 text-[var(--neon-pink)]" />}
          title="Immersive UI"
          desc="Experience neon aesthetics and smooth animations."
          delay={0.4}
        />
        <FeatureCard
          icon={<Gamepad2 className="w-10 h-10 text-[var(--neon-green)]" />}
          title="10+ Games"
          desc="From classics to new challenges, all in one place."
          delay={0.6}
        />
      </section>

      <footer className="w-full py-8 text-center text-gray-500 z-10">
        <p>© 2025 PlayWorld. Crafted with neon & code.</p>
      </footer>
    </main>
  );
}

function FeatureCard({ icon, title, desc, delay }: { icon: React.ReactNode, title: string, desc: string, delay: number }) {
  return (
    <motion.div
      className="p-8 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 hover:border-[var(--neon-purple)] transition-colors w-full md:w-80 text-center flex flex-col items-center"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.6 }}
    >
      <div className="mb-4 p-4 rounded-full bg-white/5">{icon}</div>
      <h3 className="text-2xl font-bold mb-2 text-white">{title}</h3>
      <p className="text-gray-400">{desc}</p>
    </motion.div>
  );
}
