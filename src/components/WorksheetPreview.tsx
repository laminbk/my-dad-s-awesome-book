import { forwardRef } from "react";
import { useWorksheet, PROMPTS } from "@/store/worksheet";
import { StickerLayer } from "@/components/StickerLayer";

export const WorksheetPreview = forwardRef<HTMLDivElement, { editable?: boolean }>(
  function WorksheetPreview({ editable = false }, ref) {
    const { dadName, childName, childAge, answers, drawingDataUrl } = useWorksheet();
    return (
      <div ref={ref} className="bg-white p-8 rounded-sm shadow-2xl ring-1 ring-ink/5 w-full max-w-[640px] mx-auto">
        <div className="text-center border-b-2 border-dashed border-ink/15 pb-4 mb-6">
          <div className="font-hand text-3xl text-crayon-red -rotate-1">All About My Dad</div>
          <div className="font-hand text-5xl text-ink mt-2">{dadName || "_______"}</div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="sm:col-span-2 relative aspect-[4/3] bg-canvas rounded-xl ring-1 ring-ink/10 overflow-hidden">
            {drawingDataUrl ? (
              <img src={drawingDataUrl} alt={`Drawing of ${dadName || "dad"}`} className="absolute inset-0 w-full h-full object-contain" />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center font-hand text-2xl text-ink/30">
                A picture of {dadName || "Dad"}
              </div>
            )}
            <StickerLayer editable={editable} />
          </div>

          {PROMPTS.map((p) => (
            <div key={p.key} className="p-4 bg-canvas rounded-xl ring-1 ring-ink/10">
              <div className="text-xs font-semibold uppercase tracking-wider text-ink/40 flex items-center gap-2">
                <span className="text-lg">{p.icon}</span> {p.label}
              </div>
              <div className="font-hand text-2xl text-crayon-blue mt-1 min-h-[2rem]">
                {answers[p.key] || "_______"}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 text-center font-hand text-xl text-crayon-purple">
          Made with love by {childName || "me"}{childAge ? `, age ${childAge}` : ""} 💛
        </div>
      </div>
    );
  }
);