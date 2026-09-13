import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { whoSTheToughGuy } from "./who-s-the-tough-guy.ts";

export const whoSTheToughGuyI18n = defineFamilyI18n(whoSTheToughGuy, {
  en: {
    name: "Who's the Tough Guy?",
    text: "When the combat chain closes, if this didn't hit, the defending hero creates a Toughness token.",
    typeText: "Revered Action - Attack",
  },
});
export const {
  red: whoSTheToughGuyRedI18n,
  yellow: whoSTheToughGuyYellowI18n,
  blue: whoSTheToughGuyBlueI18n,
} = whoSTheToughGuyI18n.cards;
