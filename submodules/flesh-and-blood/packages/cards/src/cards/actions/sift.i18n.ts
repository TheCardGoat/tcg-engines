import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { sift } from "./sift.ts";

export const siftI18n = defineFamilyI18n(sift, {
  en: {
    name: "Sift",
    typeText: "Generic Action",
    text: ({ maxCards }) =>
      `Put up to ${maxCards} cards from your hand on the bottom of your deck, then draw that many cards.\nGo again`,
  },
});

export const { red: siftRedI18n, yellow: siftYellowI18n, blue: siftBlueI18n } = siftI18n.cards;
