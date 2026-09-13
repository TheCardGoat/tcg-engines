import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { peaceOfMind } from "./peace-of-mind.ts";

export const peaceOfMindI18n = defineFamilyI18n(peaceOfMind, {
  en: {
    name: "Peace of Mind",
    typeText: "Generic Instant",
    text: ({ amount }) =>
      `The next time you would be dealt {p} damage, prevent ${amount} of that damage.\nCreate a Ponder token.`,
  },
});

export const {
  red: peaceOfMindRedI18n,
  yellow: peaceOfMindYellowI18n,
  blue: peaceOfMindBlueI18n,
} = peaceOfMindI18n.cards;
