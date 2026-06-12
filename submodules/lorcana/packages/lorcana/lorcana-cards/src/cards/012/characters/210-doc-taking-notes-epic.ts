import type { CharacterCard } from "@tcg/lorcana-types";
import { docTakingNotesEpicI18n } from "./210-doc-taking-notes-epic.i18n";
import { docTakingNotes } from "./040-doc-taking-notes";

export const docTakingNotesEpic: CharacterCard = {
  ...docTakingNotes,
  id: "zdO",
  cardNumber: 210,
  rarity: "common",
  specialRarity: "epic",
  i18n: docTakingNotesEpicI18n,
};
