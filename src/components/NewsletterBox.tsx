import { useState } from "react";
import { Mail, Check } from "lucide-react";
import { externalSupabase } from "@/lib/supabase-external";
import { toast } from "sonner";

export function NewsletterBox() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  const subscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    const value = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      toast.error("Oops! That doesn't look like an email address.");
      return;
    }
    setLoading(true);
    const { error } = await externalSupabase.from("newsletter_subscribers").insert({ email: value });
    setLoading(false);
    if (error) {
      if (error.code === "23505") {
        setDone(true);
        toast.success("You're already on the list!");
      } else {
        toast.error("Something went wrong — please try again.");
      }
      return;
    }
    setDone(true);
    toast.success("Yay! You're subscribed!");
  };

  return (
    <section className="py-16 px-6">
      <div className="max-w-xl mx-auto text-center bg-white rounded-3xl ring-2 ring-crayon-blue/30 border-2 border-dashed border-crayon-blue/40 p-8 rotate-[0.5deg] shadow-[4px_4px_0_rgba(59,93,199,0.25)]">
        <div className="mx-auto size-14 rounded-full bg-crayon-yellow/30 flex items-center justify-center -rotate-6 mb-4">
          <Mail className="size-7 text-crayon-blue" />
        </div>
        <h2 className="font-hand text-3xl text-crayon-blue -rotate-1">Get crafty ideas in your inbox</h2>
        <p className="mt-2 text-ink/60 text-sm">
          Sweet printable activities for the next special day — no spam, ever.
        </p>

        {done ? (
          <div className="mt-6 flex items-center justify-center gap-2 font-hand text-2xl text-crayon-green">
            <Check className="size-6" />
            You're on the list — thank you!
          </div>
        ) : (
          <form onSubmit={subscribe} className="mt-6 flex flex-col sm:flex-row gap-3">
            <label htmlFor="newsletter-email" className="sr-only">
              Email address
            </label>
            <input
              id="newsletter-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="grown-up@email.com"
              className="flex-1 min-h-12 px-4 rounded-xl border-2 border-dashed border-ink/30 bg-paper font-hand text-xl text-ink placeholder:text-ink/30 focus:outline-none focus:border-crayon-blue"
            />
            <button
              type="submit"
              disabled={loading}
              className="min-h-12 px-6 rounded-xl bg-crayon-blue text-white font-hand text-xl border-b-4 border-crayon-blue/60 active:translate-y-0.5 active:border-b-2 disabled:opacity-50"
            >
              {loading ? "Signing up…" : "Sign me up!"}
            </button>
          </form>
        )}
        <p className="mt-4 text-xs text-ink/40">We only use your email for the newsletter. Unsubscribe anytime.</p>
      </div>
    </section>
  );
}
