import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { cutDownToSize } from "./cut-down-to-size.ts";

export const cutDownToSizeI18n = defineFamilyI18n(cutDownToSize, {
  en: {
    name: "Cut Down to Size",
    typeText: "Generic Action - Attack",
    text: "When this hits a hero, if they have 4 or more cards in hand, they discard a card.",
  },
});

export const {
  red: cutDownToSizeRedI18n,
  yellow: cutDownToSizeYellowI18n,
  blue: cutDownToSizeBlueI18n,
} = cutDownToSizeI18n.cards;
