import { useEffect, useState, type CSSProperties } from "react";
import { normalizeSupporterPerkTier } from "@tcg/shared/supporter-perks";

/**
 * Cyberpunk playmat presets. Ids match the platform catalog in
 * platform/apps/web/src/lib/features/settings/game-visual-settings.ts.
 * `default` keeps the solid board. Any other unknown id falls back to it.
 */
const CYBERPUNK_PLAYMAT_ASSET_BASE = "https://cdn.tcg.online/public/cyberpunk/simulator/playmats";

export const CYBERPUNK_PLAYMAT_PRESETS = {
  default: null,
  "night-market": `${CYBERPUNK_PLAYMAT_ASSET_BASE}/night-market.webp`,
  maelstrom: `${CYBERPUNK_PLAYMAT_ASSET_BASE}/maelstrom.webp`,
  "street-fire": `${CYBERPUNK_PLAYMAT_ASSET_BASE}/street-fire.webp`,
  "arasaka-detail": `${CYBERPUNK_PLAYMAT_ASSET_BASE}/arasaka-detail.webp`,
  "signal-sprint": `${CYBERPUNK_PLAYMAT_ASSET_BASE}/signal-sprint.webp`,
} as const satisfies Record<string, string | null>;

export interface ResolvedCyberpunkPlaymat {
  id: string;
  src: string | null;
}

const DEFAULT_PLAYMAT: ResolvedCyberpunkPlaymat = { id: "default", src: null };

export function resolveCyberpunkPlaymat(selection?: string | null): ResolvedCyberpunkPlaymat {
  if (!selection || !Object.hasOwn(CYBERPUNK_PLAYMAT_PRESETS, selection)) return DEFAULT_PLAYMAT;
  const preset = CYBERPUNK_PLAYMAT_PRESETS[selection as keyof typeof CYBERPUNK_PLAYMAT_PRESETS];
  if (preset === undefined) return DEFAULT_PLAYMAT;
  return { id: selection, src: preset };
}

/** Pictured mats are a supporter perk. Everyone else keeps the bare board. */
export function cyberpunkSeatMayUsePlaymat(subscriptionTier?: string | null): boolean {
  return normalizeSupporterPerkTier(subscriptionTier) !== null;
}

export function cyberpunkSeatPlaymat(args: {
  playmatId?: string | null;
  subscriptionTier?: string | null;
  /** Test-fixture override. It is already authorized for that local seat. */
  fixturePlaymatId?: string | null;
}): ResolvedCyberpunkPlaymat {
  if (args.fixturePlaymatId) return resolveCyberpunkPlaymat(args.fixturePlaymatId);
  if (!cyberpunkSeatMayUsePlaymat(args.subscriptionTier)) return DEFAULT_PLAYMAT;
  return resolveCyberpunkPlaymat(args.playmatId);
}

/** Lets a local test board assign a mat without a hosted supporter seat. */
export function readCyberpunkFixturePlaymatId(): string | null {
  if (!import.meta.env.DEV || typeof window === "undefined") return null;
  if (!window.location.pathname.includes("/simulator/tests/")) return null;
  const id = new URLSearchParams(window.location.search).get("playmat");
  return id && id !== "default" ? id : null;
}

export function useCyberpunkFixturePlaymatId(enabled: boolean): string | null {
  const [id, setId] = useState<string | null>(null);
  useEffect(() => {
    setId(enabled ? readCyberpunkFixturePlaymatId() : null);
  }, [enabled]);
  return enabled ? id : null;
}

/**
 * Fit the whole playmat on the Eddie side of the seat. `contain` keeps the
 * source aspect ratio. Seat CSS paints `--cp-playmat-image` and mirrors the
 * opponent copy horizontally without flipping the cards.
 */
export function cyberpunkPlaymatSeatStyle(src: string | null): CSSProperties | undefined {
  if (!src) return undefined;
  const image = `url("${src.replace(/["\\()\n\r]/g, "")}")`;
  return {
    backgroundColor: "#07090c",
    ["--cp-playmat-image" as string]: image,
    ["--cp-seat-board-bg" as string]: "transparent",
    ["--cp-seat-board-zone" as string]: "rgb(7 9 12 / 28%)",
    ["--board-bg" as string]: "transparent",
    ["--board-zone" as string]: "rgb(7 9 12 / 28%)",
  };
}
