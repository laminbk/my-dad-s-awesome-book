import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type Sticker = {
  id: string;
  emoji: string;
  x: number; // 0..1
  y: number; // 0..1
  rotation: number;
  scale: number;
};

export const PROMPTS = [
  { key: "age", label: "How old is your dad?", placeholder: "Like 37 or a hundred!", icon: "🎂" },
  { key: "food", label: "Dad's favorite food is...", placeholder: "Pizza? Tacos?", icon: "🍕" },
  { key: "superpower", label: "Dad's superpower is...", placeholder: "Making the tallest pancakes!", icon: "💪" },
  { key: "laugh", label: "Dad makes me laugh when...", placeholder: "He sings in the car", icon: "😂" },
  { key: "memory", label: "My favorite memory with Dad is...", placeholder: "When we went camping", icon: "💛" },
  { key: "love", label: "I love my dad because...", placeholder: "He always reads to me", icon: "❤️" },
] as const;

export type PromptKey = (typeof PROMPTS)[number]["key"];

export type WorksheetState = {
  dadName: string;
  childName: string;
  childAge: string;
  answers: Record<string, string>;
  drawingDataUrl: string | null;
  stickers: Sticker[];
  lastSavedAt: number | null;
  setDadName: (v: string) => void;
  setChildName: (v: string) => void;
  setChildAge: (v: string) => void;
  setAnswer: (k: string, v: string) => void;
  setDrawing: (url: string | null) => void;
  addSticker: (s: Sticker) => void;
  updateSticker: (id: string, patch: Partial<Sticker>) => void;
  removeSticker: (id: string) => void;
  clearStickers: () => void;
  hydrate: (s: Partial<WorksheetState>) => void;
  reset: () => void;
};

const initial = {
  dadName: "",
  childName: "",
  childAge: "",
  answers: {} as Record<string, string>,
  drawingDataUrl: null as string | null,
  stickers: [] as Sticker[],
  lastSavedAt: null as number | null,
};

export const useWorksheet = create<WorksheetState>()(
  persist(
    (set) => ({
      ...initial,
      setDadName: (v) => set({ dadName: v, lastSavedAt: Date.now() }),
      setChildName: (v) => set({ childName: v, lastSavedAt: Date.now() }),
      setChildAge: (v) => set({ childAge: v, lastSavedAt: Date.now() }),
      setAnswer: (k, v) =>
        set((s) => ({ answers: { ...s.answers, [k]: v }, lastSavedAt: Date.now() })),
      setDrawing: (url) => set({ drawingDataUrl: url, lastSavedAt: Date.now() }),
      addSticker: (st) => set((s) => ({ stickers: [...s.stickers, st], lastSavedAt: Date.now() })),
      updateSticker: (id, patch) =>
        set((s) => ({
          stickers: s.stickers.map((x) => (x.id === id ? { ...x, ...patch } : x)),
          lastSavedAt: Date.now(),
        })),
      removeSticker: (id) =>
        set((s) => ({ stickers: s.stickers.filter((x) => x.id !== id), lastSavedAt: Date.now() })),
      clearStickers: () => set({ stickers: [], lastSavedAt: Date.now() }),
      hydrate: (s) => set({ ...s, lastSavedAt: Date.now() }),
      reset: () => set({ ...initial }),
    }),
    {
      name: "aamd:worksheet",
      storage: createJSONStorage(() =>
        typeof window === "undefined"
          ? (undefined as unknown as Storage)
          : window.localStorage
      ),
    }
  )
);

export type SerializedWorksheet = Pick<
  WorksheetState,
  "dadName" | "childName" | "childAge" | "answers" | "drawingDataUrl" | "stickers"
>;

export function snapshot(s: WorksheetState): SerializedWorksheet {
  return {
    dadName: s.dadName,
    childName: s.childName,
    childAge: s.childAge,
    answers: s.answers,
    drawingDataUrl: s.drawingDataUrl,
    stickers: s.stickers,
  };
}