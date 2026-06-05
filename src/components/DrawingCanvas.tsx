import { useEffect, useRef, useState } from "react";
import { Undo2, Trash2, Eraser } from "lucide-react";
import { useWorksheet } from "@/store/worksheet";

const COLORS = [
  { name: "Red", value: "#e11d48", token: "bg-crayon-red" },
  { name: "Blue", value: "#0284c7", token: "bg-crayon-blue" },
  { name: "Yellow", value: "#d97706", token: "bg-crayon-yellow" },
  { name: "Green", value: "#059669", token: "bg-crayon-green" },
  { name: "Purple", value: "#9333ea", token: "bg-crayon-purple" },
  { name: "Black", value: "#27272a", token: "bg-ink" },
];

export function DrawingCanvas({ overlay }: { overlay?: React.ReactNode }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const drawingRef = useRef(false);
  const lastRef = useRef<{ x: number; y: number } | null>(null);
  const historyRef = useRef<ImageData[]>([]);
  const [color, setColor] = useState(COLORS[0].value);
  const [width, setWidth] = useState(6);
  const [erasing, setErasing] = useState(false);
  const drawingDataUrl = useWorksheet((s) => s.drawingDataUrl);
  const setDrawing = useWorksheet((s) => s.setDrawing);

  // size and restore
  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const dpr = window.devicePixelRatio || 1;
    const rect = wrap.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    canvas.style.width = rect.width + "px";
    canvas.style.height = rect.height + "px";
    const ctx = canvas.getContext("2d")!;
    ctx.scale(dpr, dpr);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    if (drawingDataUrl) {
      const img = new Image();
      img.onload = () => ctx.drawImage(img, 0, 0, rect.width, rect.height);
      img.src = drawingDataUrl;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const pushHistory = () => {
    const c = canvasRef.current!;
    const ctx = c.getContext("2d")!;
    historyRef.current.push(ctx.getImageData(0, 0, c.width, c.height));
    if (historyRef.current.length > 30) historyRef.current.shift();
  };

  const point = (e: React.PointerEvent) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const onDown = (e: React.PointerEvent) => {
    (e.target as Element).setPointerCapture(e.pointerId);
    pushHistory();
    drawingRef.current = true;
    lastRef.current = point(e);
  };

  const onMove = (e: React.PointerEvent) => {
    if (!drawingRef.current) return;
    const ctx = canvasRef.current!.getContext("2d")!;
    const p = point(e);
    ctx.globalCompositeOperation = erasing ? "destination-out" : "source-over";
    ctx.strokeStyle = color;
    ctx.lineWidth = erasing ? 24 : width;
    ctx.beginPath();
    ctx.moveTo(lastRef.current!.x, lastRef.current!.y);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
    lastRef.current = p;
  };

  const onUp = () => {
    if (!drawingRef.current) return;
    drawingRef.current = false;
    lastRef.current = null;
    const url = canvasRef.current!.toDataURL("image/png");
    setDrawing(url);
  };

  const undo = () => {
    const c = canvasRef.current!;
    const ctx = c.getContext("2d")!;
    const last = historyRef.current.pop();
    if (!last) {
      ctx.clearRect(0, 0, c.width, c.height);
    } else {
      ctx.putImageData(last, 0, 0);
    }
    setDrawing(c.toDataURL("image/png"));
  };

  const clear = () => {
    const c = canvasRef.current!;
    const ctx = c.getContext("2d")!;
    pushHistory();
    ctx.clearRect(0, 0, c.width, c.height);
    setDrawing(null);
  };

  return (
    <div className="space-y-3">
      <div
        ref={wrapRef}
        className="relative aspect-[4/3] bg-white rounded-2xl ring-1 ring-ink/10 overflow-hidden touch-none"
      >
        <div className="absolute inset-0 pointer-events-none opacity-40 [background-image:radial-gradient(circle,_var(--ink)_1px,_transparent_1px)] [background-size:24px_24px]" />
        <canvas
          ref={canvasRef}
          className="absolute inset-0 cursor-crosshair"
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerCancel={onUp}
          onPointerLeave={onUp}
          aria-label="Drawing area for your dad"
        />
        {overlay}
      </div>
      <div className="flex flex-wrap gap-2 items-center justify-between p-3 bg-white rounded-2xl ring-1 ring-ink/10">
        <div className="flex gap-2 items-center flex-wrap">
          {COLORS.map((c) => (
            <button
              key={c.value}
              onClick={() => {
                setColor(c.value);
                setErasing(false);
              }}
              aria-label={`Pick ${c.name} crayon`}
              className={
                "size-10 rounded-full transition-transform " +
                c.token +
                (color === c.value && !erasing
                  ? " ring-2 ring-offset-2 ring-ink scale-110"
                  : " hover:scale-110")
              }
            />
          ))}
          <div className="w-px h-8 bg-ink/10 mx-1" />
          <label className="flex items-center gap-2 text-xs text-ink/60">
            Size
            <input
              type="range"
              min={2}
              max={20}
              value={width}
              onChange={(e) => setWidth(Number(e.target.value))}
              className="accent-crayon-blue"
            />
          </label>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setErasing((v) => !v)}
            aria-pressed={erasing}
            className={
              "min-h-11 px-3 rounded-xl inline-flex items-center gap-2 text-sm font-medium " +
              (erasing ? "bg-ink text-white" : "bg-canvas hover:bg-ink/5")
            }
          >
            <Eraser className="size-4" /> Eraser
          </button>
          <button onClick={undo} className="min-h-11 px-3 rounded-xl bg-canvas hover:bg-ink/5 inline-flex items-center gap-2 text-sm font-medium">
            <Undo2 className="size-4" /> Undo
          </button>
          <button onClick={clear} className="min-h-11 px-3 rounded-xl bg-canvas hover:bg-ink/5 inline-flex items-center gap-2 text-sm font-medium">
            <Trash2 className="size-4" /> Clear
          </button>
        </div>
      </div>
    </div>
  );
}