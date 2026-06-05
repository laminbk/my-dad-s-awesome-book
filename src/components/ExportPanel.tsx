import { useState, type RefObject } from "react";
import { Download, Printer, Share2, Check } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useWorksheet, snapshot } from "@/store/worksheet";
import { encodeWorksheet } from "@/lib/share-link";

export function ExportPanel({ targetRef }: { targetRef: RefObject<HTMLDivElement | null> }) {
  const state = useWorksheet();
  const [copied, setCopied] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);

  const downloadPdf = async () => {
    if (!targetRef.current) return;
    setBusy("pdf");
    try {
      const canvas = await html2canvas(targetRef.current, { backgroundColor: "#ffffff", scale: 2, useCORS: true });
      const img = canvas.toDataURL("image/png");
      const pdf = new jsPDF({ unit: "pt", format: "a4" });
      const pageW = pdf.internal.pageSize.getWidth();
      const pageH = pdf.internal.pageSize.getHeight();
      const ratio = canvas.height / canvas.width;
      const w = pageW - 40;
      const h = Math.min(w * ratio, pageH - 40);
      pdf.addImage(img, "PNG", 20, 20, w, h);
      pdf.save(`${(state.dadName || "my-dad").replace(/\s+/g, "-")}-story.pdf`);
    } finally {
      setBusy(null);
    }
  };

  const printNow = () => window.print();

  const copyLink = async () => {
    const hash = encodeWorksheet(snapshot(state));
    const url = `${window.location.origin}/preview#${hash}`;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      <ActionCard
        color="green"
        icon={<Download className="size-6" />}
        title="Download PDF"
        desc="Save it on your computer to keep forever."
        cta={busy === "pdf" ? "Saving..." : "Save PDF"}
        onClick={downloadPdf}
      />
      <ActionCard
        color="yellow"
        icon={<Printer className="size-6" />}
        title="Print it out"
        desc="Make a real paper copy for Dad's fridge."
        cta="Print"
        onClick={printNow}
      />
      <ActionCard
        color="blue"
        icon={copied ? <Check className="size-6" /> : <Share2 className="size-6" />}
        title="Share a secret link"
        desc="Only people with the link can see it. No account needed."
        cta={copied ? "Copied!" : "Copy Link"}
        onClick={copyLink}
      />
    </div>
  );
}

function ActionCard({
  color,
  icon,
  title,
  desc,
  cta,
  onClick,
}: {
  color: "green" | "yellow" | "blue";
  icon: React.ReactNode;
  title: string;
  desc: string;
  cta: string;
  onClick: () => void;
}) {
  const tint = {
    green: "bg-crayon-green/10 text-crayon-green",
    yellow: "bg-crayon-yellow/15 text-crayon-yellow",
    blue: "bg-crayon-blue/10 text-crayon-blue",
  }[color];
  return (
    <div className="p-5 bg-white rounded-2xl ring-1 ring-ink/10 flex gap-4 items-center">
      <div className={"size-14 rounded-full flex items-center justify-center shrink-0 " + tint}>{icon}</div>
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-ink">{title}</h4>
        <p className="text-sm text-ink/60">{desc}</p>
      </div>
      <button
        onClick={onClick}
        className="min-h-11 px-5 bg-ink text-white rounded-xl text-sm font-semibold hover:bg-ink/85 transition-colors"
      >
        {cta}
      </button>
    </div>
  );
}