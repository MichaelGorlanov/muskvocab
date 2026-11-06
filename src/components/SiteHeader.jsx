import { Link } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0B2D25]/95 backdrop-blur">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-6 sm:px-8">
        <Link to="/" className="group flex items-center gap-2.5">
          <span className="grid h-7 w-7 place-items-center rounded-lg bg-[#E8F4B8] text-[#0B2D25]">
            <Sparkles className="h-4 w-4" />
          </span>
          <span className="font-display text-lg tracking-tight text-[#F1F7DA]">
            Vocab Lab
          </span>
        </Link>
        <nav className="flex items-center gap-6 font-mono text-[11px] uppercase tracking-[0.18em] text-[#F1F7DA]/60">
          <Link to="/" className="transition-colors hover:text-[#E8F4B8] [&.active]:text-[#E8F4B8]">
            Practice
          </Link>
          <Link to="/flashcards" className="transition-colors hover:text-[#E8F4B8] [&.active]:text-[#E8F4B8]">
            Flashcards
          </Link>
          <Link to="/words" className="transition-colors hover:text-[#E8F4B8] [&.active]:text-[#E8F4B8]">
            Word bank
          </Link>
        </nav>
      </div>
    </header>
  );
}