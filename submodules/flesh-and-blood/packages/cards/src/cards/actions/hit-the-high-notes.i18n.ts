import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { hitTheHighNotes } from "./hit-the-high-notes.ts";

export const hitTheHighNotesI18n = defineFamilyI18n(hitTheHighNotes, {
  en: {
    name: "Hit the High Notes",
    text: "If you've played or created an aura this turn, this gets +2{p}.",
    typeText: "Runeblade Action - Attack",
  },
});

export const {
  red: hitTheHighNotesRedI18n,
  yellow: hitTheHighNotesYellowI18n,
  blue: hitTheHighNotesBlueI18n,
} = hitTheHighNotesI18n.cards;
