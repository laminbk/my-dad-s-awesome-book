import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { Plus, Sparkles, PenTool, Download } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "All About My Dad — A storybook just for him" },
      { name: "description", content: "A free, child-friendly worksheet where kids 4-12 can write, draw, and decorate a one-of-a-kind digital tribute for Dad." },
      { property: "og:title", content: "All About My Dad — A storybook just for him" },
      { property: "og:description", content: "Free, child-friendly worksheet for kids 4-12 to make a digital tribute for Dad." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-[calc(100vh-64px)]">
      <section className="py-16 sm:py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <span className="font-hand text-2xl text-crayon-blue inline-block -rotate-2">A special gift just for him</span>
          <h1 className="mt-4 text-5xl sm:text-6xl lg:text-7xl font-semibold text-ink text-balance leading-tight">
            Create a Storybook<br />
            <span className="font-hand text-crayon-red text-6xl sm:text-7xl lg:text-8xl inline-block rotate-[-2deg]">All About My Dad</span>
          </h1>
          <p className="mt-8 max-w-[48ch] mx-auto text-ink/65 text-lg text-pretty">
            Pick your favorite colors, add silly stickers, and draw a picture of Dad to make a digital gift he'll keep forever.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center items-center">
            <Link
              to="/worksheet"
              className="inline-flex items-center gap-3 min-h-14 bg-crayon-red text-white py-4 px-7 rounded-2xl font-semibold text-lg ring-4 ring-crayon-red/20 shadow-xl hover:scale-105 transition-transform"
            >
              <Plus className="size-5" strokeWidth={3} />
              Start my Dad's Story
            </Link>
            <a
              href="#how"
              className="inline-flex items-center min-h-14 px-5 text-ink/60 font-medium hover:text-ink"
            >
              How does it work?
            </a>
          </div>
          <p className="mt-6 text-sm text-ink/40">Free • No sign-up • Takes about 5 minutes</p>
        </div>
      </section>

      <section id="how" className="py-16 px-6 border-y border-ink/10 bg-white/40">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-hand text-4xl text-center text-crayon-blue -rotate-1 mb-12">Here's how it works</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Step n={1} icon={<Sparkles className="size-6" />} title="Answer fun questions" desc="Tell us about your dad — his name, his favorite food, his superpower." color="red" />
            <Step n={2} icon={<PenTool className="size-6" />} title="Draw & decorate" desc="Doodle a picture of Dad, then add stickers and colors to make it pop." color="blue" />
            <Step n={3} icon={<Download className="size-6" />} title="Print or share" desc="Save it as a PDF, print it for his fridge, or send a secret link." color="green" />
          </div>
        </div>
      </section>

      <footer className="py-10 text-center text-sm text-ink/40">
        <p className="font-hand text-xl text-ink/40">Made with lots of love</p>
        <p className="mt-2">Privacy-safe • No account required • Works on tablets & phones</p>
      </footer>
    </div>
  );
}

function Step({ n, icon, title, desc, color }: { n: number; icon: React.ReactNode; title: string; desc: string; color: "red" | "blue" | "green" }) {
  const tint = {
    red: "bg-crayon-red/10 text-crayon-red",
    blue: "bg-crayon-blue/10 text-crayon-blue",
    green: "bg-crayon-green/10 text-crayon-green",
  }[color];
  return (
    <div className="p-6 bg-white rounded-2xl ring-1 ring-ink/10">
      <div className="flex items-center gap-3 mb-3">
        <div className={"size-12 rounded-full flex items-center justify-center " + tint}>{icon}</div>
        <span className="font-hand text-3xl text-ink/30">{n}</span>
      </div>
      <h3 className="font-semibold text-lg text-ink">{title}</h3>
      <p className="mt-1 text-sm text-ink/60">{desc}</p>
    </div>
  );
}
