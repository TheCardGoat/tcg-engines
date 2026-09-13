import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { veiledIntentions } from "./veiled-intentions.ts";

export const veiledIntentionsI18n = defineFamilyI18n(veiledIntentions, {
  en: {
    name: "Veiled Intentions",
    text: ({ value1 }) =>
      `Go again
The next attack action card you play this turn is Illusionist in addition to its other card, and gains +${value1}{p}, phantasm, and "When this is destroyed, draw a card."`,
    typeText: "Illusionist Action",
  },
});

export const {
  red: veiledIntentionsRedI18n,
  yellow: veiledIntentionsYellowI18n,
  blue: veiledIntentionsBlueI18n,
} = veiledIntentionsI18n.cards;
