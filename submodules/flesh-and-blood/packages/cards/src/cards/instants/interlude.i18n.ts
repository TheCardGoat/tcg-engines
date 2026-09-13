import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { interlude } from "./interlude.ts";

export const interludeI18n = defineFamilyI18n(interlude, {
  en: {
    name: "Interlude",
    typeText: "Bard Instant",
    text: (amount) =>
      `Choose a hero. The next time they would be dealt damage this turn, prevent ${amount} of that damage. If you prevent damage to another hero this way, create a Copper token.`,
  },
});

export const {
  red: interludeRedI18n,
  yellow: interludeYellowI18n,
  blue: interludeBlueI18n,
} = interludeI18n.cards;
