import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { saveTheThought } from "./save-the-thought.ts";

export const saveTheThoughtI18n = defineFamilyI18n(saveTheThought, {
  en: {
    name: "Save the Thought",
    typeText: "Wizard Instant",
    text: ({ count }) =>
      `Shuffle up to ${count} non-attack action card${count === 1 ? "" : "s"} from your graveyard into your deck.\nCreate a Ponder token.`,
  },
});

export const {
  red: saveTheThoughtRedI18n,
  yellow: saveTheThoughtYellowI18n,
  blue: saveTheThoughtBlueI18n,
} = saveTheThoughtI18n.cards;
