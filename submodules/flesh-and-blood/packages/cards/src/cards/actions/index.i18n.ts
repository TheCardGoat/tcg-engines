import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { index } from "./index.ts";

export const indexI18n = defineFamilyI18n(index, {
  en: {
    name: "Index",
    text: "Look at the top 5 cards of your deck. Put 1 card from among them on top of your deck, and the rest on the bottom of your deck in any order.",
    typeText: "Wizard Action",
  },
});

export const { red: indexRedI18n, yellow: indexYellowI18n, blue: indexBlueI18n } = indexI18n.cards;
