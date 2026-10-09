const CARD_BACK_ASSET_BASE = "https://cdn.tcg.online/public/thecardgoat/home/card-back";

/** Legend backs stay distinct under Cyberpunk TCG rule 3.2.1. */
export const CYBERPUNK_CARD_BACK_OPTIONS = [
  {
    id: "default",
    label: "Default",
    src: "https://cdn.tcg.online/public/cyberpunk/cards/back/card-back.webp",
  },
  {
    id: "goat-classic",
    label: "Card Goat Classic",
    src: `${CARD_BACK_ASSET_BASE}/v1/card-back-400.webp`,
  },
  {
    id: "goat-geometric",
    label: "Card Goat Geometric",
    src: `${CARD_BACK_ASSET_BASE}/v2/card-back-400.webp`,
  },
  {
    id: "goat-celestial",
    label: "Card Goat Celestial",
    src: `${CARD_BACK_ASSET_BASE}/v3/card-back-400.webp`,
  },
  {
    id: "goat-heraldic",
    label: "Card Goat Heraldic",
    src: `${CARD_BACK_ASSET_BASE}/v4/card-back-400.webp`,
  },
] as const;

export const CYBERPUNK_PLAYMAT_OPTIONS = [
  { id: "default", label: "None", premium: false },
  { id: "night-market", label: "Night Market", premium: true },
  { id: "maelstrom", label: "Maelstrom", premium: true },
  { id: "street-fire", label: "Street Fire", premium: true },
  { id: "arasaka-detail", label: "Arasaka Detail", premium: true },
  { id: "signal-sprint", label: "Signal Sprint", premium: true },
] as const;

export type CyberpunkCardBackId = (typeof CYBERPUNK_CARD_BACK_OPTIONS)[number]["id"];
export type CyberpunkPlaymatId = (typeof CYBERPUNK_PLAYMAT_OPTIONS)[number]["id"];

export interface CyberpunkVisualSelection {
  cardBackId: CyberpunkCardBackId;
  playmatId: CyberpunkPlaymatId;
}

export const DEFAULT_CYBERPUNK_VISUAL_SELECTION: CyberpunkVisualSelection = {
  cardBackId: "default",
  playmatId: "default",
};

export function resolveCyberpunkCardBackId(value: string | null | undefined): CyberpunkCardBackId {
  return CYBERPUNK_CARD_BACK_OPTIONS.find((option) => option.id === value)?.id ?? "default";
}

export function resolveCyberpunkPlaymatId(value: string | null | undefined): CyberpunkPlaymatId {
  return CYBERPUNK_PLAYMAT_OPTIONS.find((option) => option.id === value)?.id ?? "default";
}

export function cyberpunkCardBackUrl(id: string | null | undefined, cardType?: string): string {
  if (cardType === "legend") {
    return "https://cdn.tcg.online/public/cyberpunk/cards/back/legend-card-back.webp";
  }
  return (
    CYBERPUNK_CARD_BACK_OPTIONS.find((option) => option.id === id)?.src ??
    CYBERPUNK_CARD_BACK_OPTIONS[0].src
  );
}
