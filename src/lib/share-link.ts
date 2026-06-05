import LZString from "lz-string";
import type { SerializedWorksheet } from "@/store/worksheet";

export function encodeWorksheet(data: SerializedWorksheet): string {
  return LZString.compressToEncodedURIComponent(JSON.stringify(data));
}

export function decodeWorksheet(hash: string): SerializedWorksheet | null {
  try {
    const raw = LZString.decompressFromEncodedURIComponent(hash);
    if (!raw) return null;
    return JSON.parse(raw) as SerializedWorksheet;
  } catch {
    return null;
  }
}