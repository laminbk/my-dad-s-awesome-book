import { useRef, useState } from "react";
import { X } from "lucide-react";
import { useWorksheet, type Sticker } from "@/store/worksheet";

export function StickerLayer({ editable = true }: { editable?: boolean }) {
  const stickers = useWorksheet((s) => s.stickers);
  const updateSticker = useWorksheet((s) => s.updateSticker);
  const removeSticker = useWorksheet((s) => s.removeSticker);
  const wrapRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={wrapRef} className="absolute inset-0">
      {stickers.map((s) => (
        <StickerItem
          key={s.id}
          sticker={s}
          wrapRef={wrapRef}
          editable={editable}
          onUpdate={(patch) => updateSticker(s.id, patch)}
          onRemove={() => removeSticker(s.id)}
        />
      ))}
    </div>
  );
}

function StickerItem({
  sticker,
  wrapRef,
  editable,
  onUpdate,
  onRemove,
}: {
  sticker: Sticker;
  wrapRef: React.RefObject<HTMLDivElement | null>;
  editable: boolean;
  onUpdate: (p: Partial<Sticker>) => void;
  onRemove: () => void;
}) {
  const [dragging, setDragging] = useState(false);

  const onDown = (e: React.PointerEvent) => {
    if (!editable) return;
    e.stopPropagation();
    (e.target as Element).setPointerCapture(e.pointerId);
    setDragging(true);
  };
  const onMove = (e: React.PointerEvent) => {
    if (!dragging || !wrapRef.current) return;
    const rect = wrapRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    onUpdate({ x: Math.max(0, Math.min(1, x)), y: Math.max(0, Math.min(1, y)) });
  };
  const onUp = () => setDragging(false);

  return (
    <div
      className="absolute group select-none"
      style={{
        left: `${sticker.x * 100}%`,
        top: `${sticker.y * 100}%`,
        transform: `translate(-50%, -50%) rotate(${sticker.rotation}deg) scale(${sticker.scale})`,
        touchAction: "none",
      }}
      onPointerDown={onDown}
      onPointerMove={onMove}
      onPointerUp={onUp}
      onPointerCancel={onUp}
    >
      <span className="text-5xl cursor-grab active:cursor-grabbing drop-shadow-md">{sticker.emoji}</span>
      {editable && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="absolute -top-2 -right-2 size-6 rounded-full bg-ink text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
          aria-label="Remove sticker"
        >
          <X className="size-3" />
        </button>
      )}
    </div>
  );
}