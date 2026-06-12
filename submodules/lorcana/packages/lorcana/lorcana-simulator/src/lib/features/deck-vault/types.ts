import type { LorcanaInkName } from "@/features/simulator/model/lorcana-colors.js";
import type { ProfileDeckSummary } from "@/features/matchmaking/api/player-context-api.js";
import type { LorcanaFormatId } from "@tcg/lorcana-types";
import { colorMaskToInks } from "./color-mask.js";

/** Presentation-only deck item for the vault grid. */
export interface DeckVaultItem {
  id: string;
  name: string;
  inks: LorcanaInkName[];
  cardCount: number;
  updatedAt: string;
  archetype?: string;
  winRate?: number | null;
  isSelected?: boolean;
  validFormats: LorcanaFormatId[];
}

/** Convert a matchmaking ProfileDeckSummary to a DeckVaultItem. */
export function profileDeckSummaryToVaultItem(
  deck: ProfileDeckSummary,
  selectedDeckId: string | null,
): DeckVaultItem {
  return {
    id: deck.deckId,
    name: deck.deckName,
    inks: colorMaskToInks(deck.colorMask),
    cardCount: deck.cardCount,
    updatedAt: deck.updatedAt,
    isSelected: deck.deckId === selectedDeckId,
    validFormats: deck.validFormats,
  };
}
