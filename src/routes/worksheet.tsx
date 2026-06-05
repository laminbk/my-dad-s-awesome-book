import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronLeft, ChevronRight, Volume2 } from "lucide-react";
import { useWorksheet, PROMPTS } from "@/store/worksheet";
import { DrawingCanvas } from "@/components/DrawingCanvas";
import { StickerTray } from "@/components/StickerTray";
import { StickerLayer } from "@/components/StickerLayer";
import { speak } from "@/components/AccessibilityBar";

export const Route = createFileRoute("/worksheet")({
  head: () => ({
    meta: [
      { title: "Build your Dad's storybook — All About My Dad" },
      { name: "description", content: "Answer playful prompts, draw a picture of Dad, and decorate with stickers." },
    ],
  }),
  component: WorksheetPage,
});

const STEPS = ["Dad's name", "About Dad", "Decorate", "Sign it"] as const;

function readAloudOn() {
  return typeof document !== "undefined" && document.documentElement.dataset.readaloud === "on";
}

function Speak({ text }: { text: string }) {
  return (
    <button
      type="button"
      onClick={() => speak(text)}
      aria-label="Read aloud"
      className="inline-flex items-center justify-center size-9 rounded-full text-crayon-blue hover:bg-crayon-blue/10"
    >
      <Volume2 className="size-4" />
    </button>
  );
}

function WorksheetPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const { dadName, childName, childAge, answers, setDadName, setChildName, setChildAge, setAnswer } =
    useWorksheet();
  const [hint, setHint] = useState<string | null>(null);

  const next = () => {
    if (step === 0 && !dadName.trim()) {
      setHint("Add Dad's name first so we can finish his story!");
      return;
    }
    setHint(null);
    if (step < STEPS.length - 1) {
      setStep(step + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      navigate({ to: "/preview" });
    }
  };
  const back = () => {
    setHint(null);
    if (step === 0) navigate({ to: "/" });
    else setStep(step - 1);
  };

  const speakIf = (t: string) => readAloudOn() && speak(t);

  return (
    <div className="py-8 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white ring-1 ring-ink/10 rounded-[28px] overflow-hidden shadow-sm">
          {/* Stepper Header */}
          <div className="flex border-b border-ink/10">
            {STEPS.map((s, i) => (
              <button
                key={s}
                onClick={() => i < step && setStep(i)}
                className={
                  "flex-1 py-4 px-2 text-center text-xs sm:text-sm font-semibold border-b-4 transition-colors " +
                  (i === step
                    ? "border-crayon-blue text-crayon-blue"
                    : i < step
                    ? "border-crayon-green/40 text-crayon-green hover:bg-canvas"
                    : "border-transparent text-ink/30")
                }
              >
                {i + 1}. {s}
              </button>
            ))}
          </div>

          <div className="p-6 sm:p-10">
            {step === 0 && (
              <div className="max-w-xl mx-auto space-y-6">
                <div>
                  <div className="flex items-center gap-2">
                    <label className="font-hand text-3xl text-crayon-red block">My dad's name is...</label>
                    <Speak text="My dad's name is" />
                  </div>
                  <input
                    autoFocus
                    type="text"
                    value={dadName}
                    onChange={(e) => {
                      setDadName(e.target.value);
                      setHint(null);
                    }}
                    onFocus={() => speakIf("My dad's name is")}
                    placeholder="Write his name here"
                    className="mt-3 w-full text-4xl font-hand bg-transparent border-b-4 border-dashed border-ink/20 focus:border-crayon-blue focus:outline-none py-3 placeholder:text-ink/20"
                  />
                  <div className="mt-3 flex flex-wrap gap-2">
                    {["Super Dave", "Daddy", "Papa", "Big John"].map((ex) => (
                      <button
                        key={ex}
                        onClick={() => setDadName(ex)}
                        className="text-xs px-3 py-1 rounded-full bg-canvas hover:bg-crayon-yellow/20 text-ink/60"
                      >
                        Try "{ex}"
                      </button>
                    ))}
                  </div>
                  {hint && (
                    <p className="mt-4 p-3 rounded-xl bg-crayon-yellow/15 text-crayon-yellow font-medium text-sm">
                      {hint}
                    </p>
                  )}
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="max-w-2xl mx-auto space-y-6">
                <p className="font-hand text-3xl text-crayon-blue text-center -rotate-1">
                  Tell us about {dadName || "Dad"}!
                </p>
                <div className="grid sm:grid-cols-2 gap-4">
                  {PROMPTS.map((p) => (
                    <div key={p.key} className="p-4 bg-canvas rounded-2xl ring-1 ring-ink/5">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl">{p.icon}</span>
                        <label className="text-sm font-semibold text-ink/70 flex-1">{p.label}</label>
                        <Speak text={p.label} />
                      </div>
                      <input
                        type="text"
                        value={answers[p.key] || ""}
                        onChange={(e) => setAnswer(p.key, e.target.value)}
                        onFocus={() => speakIf(p.label)}
                        placeholder={p.placeholder}
                        className="w-full text-xl font-hand bg-transparent border-b-2 border-dashed border-ink/20 focus:border-crayon-blue focus:outline-none py-1 placeholder:text-ink/20"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="flex flex-col lg:flex-row gap-6">
                <div className="flex-1 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="font-hand text-3xl text-crayon-blue">Draw a picture of {dadName || "Dad"}!</label>
                    <Speak text={`Draw a picture of ${dadName || "Dad"}!`} />
                  </div>
                  <div className="relative">
                    <DrawingCanvas />
                    {/* sticker overlay sits on top of canvas wrap via portal-like absolute positioning */}
                  </div>
                  <div className="relative h-0">
                    {/* This intentionally empty — stickers render inside the canvas wrapper below via separate layer */}
                  </div>
                </div>
                <div className="w-full lg:w-72 shrink-0">
                  <StickerTray />
                </div>
                {/* Floating stickers overlay on top of preview drawing area */}
                <StickerOverlayInCanvas />
              </div>
            )}

            {step === 3 && (
              <div className="max-w-xl mx-auto space-y-6">
                <p className="font-hand text-3xl text-crayon-purple text-center -rotate-1">Sign your masterpiece!</p>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="p-4 bg-canvas rounded-2xl ring-1 ring-ink/5">
                    <label className="text-sm font-semibold text-ink/70">My name is</label>
                    <input
                      value={childName}
                      onChange={(e) => setChildName(e.target.value)}
                      placeholder="Your name"
                      className="mt-2 w-full text-2xl font-hand bg-transparent border-b-2 border-dashed border-ink/20 focus:border-crayon-blue focus:outline-none py-1 placeholder:text-ink/20"
                    />
                  </div>
                  <div className="p-4 bg-canvas rounded-2xl ring-1 ring-ink/5">
                    <label className="text-sm font-semibold text-ink/70">I am</label>
                    <input
                      value={childAge}
                      onChange={(e) => setChildAge(e.target.value)}
                      placeholder="Your age"
                      inputMode="numeric"
                      className="mt-2 w-full text-2xl font-hand bg-transparent border-b-2 border-dashed border-ink/20 focus:border-crayon-blue focus:outline-none py-1 placeholder:text-ink/20"
                    />
                  </div>
                </div>
                <p className="text-center text-sm text-ink/50">
                  Click "See Preview" to look at your finished storybook before you print it!
                </p>
              </div>
            )}
          </div>

          <div className="p-5 bg-canvas border-t border-ink/10 flex justify-between items-center">
            <button
              onClick={back}
              className="min-h-11 px-5 inline-flex items-center gap-2 rounded-xl text-ink/60 hover:text-ink hover:bg-white font-medium"
            >
              <ChevronLeft className="size-4" />
              {step === 0 ? "Home" : "Back"}
            </button>
            <div className="text-xs text-ink/40 font-semibold tracking-widest uppercase">
              Step {step + 1} of {STEPS.length}
            </div>
            <button
              onClick={next}
              className="min-h-12 px-5 inline-flex items-center gap-2 bg-ink text-white rounded-xl font-semibold hover:bg-ink/85"
            >
              {step === STEPS.length - 1 ? "See Preview" : "Next"}
              <ChevronRight className="size-4" />
            </button>
          </div>
        </div>

        <p className="text-center mt-4 text-xs text-ink/40">
          Your work saves automatically. Close the tab and come back anytime.
          {" "}<Link to="/" className="underline">Home</Link>
        </p>
      </div>
    </div>
  );
}

// Render sticker layer on top of drawing canvas using a fixed positioning trick:
// we look up the canvas wrapper by data attribute. Simpler: keep stickers in a sibling absolute overlay.
function StickerOverlayInCanvas() {
  // Renders an absolutely positioned layer matching the previous DrawingCanvas wrap.
  // To avoid a portal, we render an inline overlay below; layout-wise it sits behind the tray.
  return (
    <div className="hidden" aria-hidden>
      <StickerLayer editable />
    </div>
  );
}