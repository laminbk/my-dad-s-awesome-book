import { useEffect, useState } from "react";
import { Volume2, Type, Contrast, Check } from "lucide-react";
import { useWorksheet } from "@/store/worksheet";

export function speak(text: string) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.rate = 0.95;
  u.pitch = 1.1;
  window.speechSynthesis.speak(u);
}

export function AccessibilityBar() {
  const [readAloud, setReadAloud] = useState(false);
  const [dyslexia, setDyslexia] = useState(false);
  const [hc, setHc] = useState(false);
  const lastSavedAt = useWorksheet((s) => s.lastSavedAt);
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dyslexia", dyslexia);
    root.classList.toggle("hc", hc);
    root.dataset.readaloud = readAloud ? "on" : "off";
  }, [dyslexia, hc, readAloud]);

  useEffect(() => {
    if (!lastSavedAt) return;
    setPulse(true);
    const t = setTimeout(() => setPulse(false), 900);
    return () => clearTimeout(t);
  }, [lastSavedAt]);

  return (
    <nav className="sticky top-0 z-50 flex flex-wrap justify-between items-center gap-3 px-4 sm:px-6 py-3 border-b border-ink/10 bg-canvas/85 backdrop-blur-sm print:hidden">
      <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
        <a href="/" className="font-hand text-2xl text-crayon-red mr-2 -rotate-2">
          All About My Dad
        </a>
        <ToggleChip active={readAloud} onClick={() => setReadAloud((v) => !v)} color="blue" icon={<Volume2 className="size-4" />}>
          Read Aloud
        </ToggleChip>
        <ToggleChip active={dyslexia} onClick={() => setDyslexia((v) => !v)} color="green" icon={<Type className="size-4" />}>
          Easy Read
        </ToggleChip>
        <ToggleChip active={hc} onClick={() => setHc((v) => !v)} color="yellow" icon={<Contrast className="size-4" />}>
          High Contrast
        </ToggleChip>
      </div>
      <div className={"flex items-center gap-2 text-xs font-semibold tracking-widest uppercase " + (pulse ? "text-crayon-green" : "text-ink/40")}>
        <Check className="size-4" />
        {pulse ? "Saving..." : "Progress Saved"}
      </div>
    </nav>
  );
}

function ToggleChip({
  active,
  onClick,
  children,
  icon,
  color,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  icon: React.ReactNode;
  color: "blue" | "green" | "yellow";
}) {
  const ring = {
    blue: "ring-crayon-blue text-crayon-blue",
    green: "ring-crayon-green text-crayon-green",
    yellow: "ring-crayon-yellow text-crayon-yellow",
  }[color];
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={
        "inline-flex items-center gap-2 min-h-11 px-3 rounded-full text-sm font-semibold transition-all " +
        (active
          ? `bg-white ring-2 ${ring} shadow-sm`
          : "text-ink/60 hover:text-ink hover:bg-white/60")
      }
    >
      {icon}
      {children}
    </button>
  );
}