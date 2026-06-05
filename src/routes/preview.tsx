import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { ChevronLeft } from "lucide-react";
import { WorksheetPreview } from "@/components/WorksheetPreview";
import { ExportPanel } from "@/components/ExportPanel";
import { ConfettiBurst } from "@/components/Confetti";
import { useWorksheet } from "@/store/worksheet";
import { decodeWorksheet } from "@/lib/share-link";

export const Route = createFileRoute("/preview")({
  head: () => ({
    meta: [
      { title: "Your Dad's storybook is ready! — All About My Dad" },
      { name: "description", content: "Preview, print, download or share your finished tribute to Dad." },
    ],
  }),
  component: PreviewPage,
});

function PreviewPage() {
  const ref = useRef<HTMLDivElement>(null);
  const hydrate = useWorksheet((s) => s.hydrate);

  useEffect(() => {
    const hash = window.location.hash.replace(/^#/, "");
    if (hash.length > 8) {
      const data = decodeWorksheet(hash);
      if (data) hydrate(data);
    }
  }, [hydrate]);

  return (
    <div className="py-10 px-4 sm:px-6 print:py-0 print:px-0">
      <ConfettiBurst />
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8 print:hidden">
          <span className="font-hand text-2xl text-crayon-blue -rotate-1 inline-block">Ta-da!</span>
          <h1 className="mt-2 text-4xl sm:text-5xl font-semibold text-ink">
            Your storybook is ready
          </h1>
          <p className="mt-3 text-ink/60 max-w-md mx-auto">
            Take one last look, then save it, print it, or share a secret link with Dad.
          </p>
        </div>

        <div className="grid lg:grid-cols-[1fr_360px] gap-8 items-start">
          <div className="rotate-[-0.5deg]">
            <div ref={ref}>
              <WorksheetPreview editable={false} />
            </div>
          </div>
          <div className="space-y-4 print:hidden">
            <ExportPanel targetRef={ref} />
            <Link
              to="/worksheet"
              className="w-full inline-flex justify-center items-center gap-2 min-h-11 px-4 py-3 rounded-xl bg-white ring-1 ring-ink/10 text-ink/70 hover:bg-canvas font-medium"
            >
              <ChevronLeft className="size-4" /> Edit my answers
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}