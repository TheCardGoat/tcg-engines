import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { sutcliffeSResearchNotes } from "./sutcliffe-s-research-notes.ts";

export const sutcliffeSResearchNotesI18n = defineFamilyI18n(sutcliffeSResearchNotes, {
  en: {
    name: "Sutcliffe's Research Notes",
    text: (count) =>
      `Reveal the top ${count === 1 ? "card" : count + " cards"} of your deck. Create a Runechant token for each Runeblade attack action card revealed this way, then put the cards on top of your deck in any order.\nGo again`,
    typeText: "Runeblade Action",
  },
});

export const {
  red: sutcliffeSResearchNotesRedI18n,
  yellow: sutcliffeSResearchNotesYellowI18n,
  blue: sutcliffeSResearchNotesBlueI18n,
} = sutcliffeSResearchNotesI18n.cards;
