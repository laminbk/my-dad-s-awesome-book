import { useWorksheet } from "@/store/worksheet";

const STICKERS = ["⭐", "❤️", "👑", "🦸", "🏆", "🍕", "🎸", "⚽", "🚀", "🌟", "🎈", "🧢", "🔥", "🥞", "💪", "😂"];

export function StickerTray() {
  const addSticker = useWorksheet((s) => s.addSticker);

  const add = (emoji: string) => {
    addSticker({
      id: Math.random().toString(36).slice(2),
      emoji,
      x: 0.15 + Math.random() * 0.7,
      y: 0.15 + Math.random() * 0.7,
      rotation: (Math.random() - 0.5) * 30,
      scale: 1,
    });
  };

  return (
    <div className="p-5 bg-white rounded-2xl ring-1 ring-ink/10">
      <h3 className="font-hand text-2xl text-crayon-purple mb-3">Sticker Box</h3>
      <div className="grid grid-cols-4 gap-2">
        {STICKERS.map((s) => (
          <button
            key={s}
            onClick={() => add(s)}
            aria-label={`Add ${s} sticker`}
            className="aspect-square min-h-11 rounded-xl bg-canvas hover:scale-110 transition-transform ring-1 ring-ink/5 text-3xl flex items-center justify-center"
          >
            {s}
          </button>
        ))}
      </div>
      <p className="mt-3 text-xs text-ink/40 text-center">Tap to stick on your picture!</p>
    </div>
  );
}