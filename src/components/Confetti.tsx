import { useEffect } from "react";
import confetti from "canvas-confetti";

export function ConfettiBurst() {
  useEffect(() => {
    const duration = 1500;
    const end = Date.now() + duration;
    const colors = ["#e11d48", "#0284c7", "#d97706", "#059669", "#9333ea"];
    (function frame() {
      confetti({ particleCount: 4, angle: 60, spread: 65, origin: { x: 0 }, colors });
      confetti({ particleCount: 4, angle: 120, spread: 65, origin: { x: 1 }, colors });
      if (Date.now() < end) requestAnimationFrame(frame);
    })();
  }, []);
  return null;
}