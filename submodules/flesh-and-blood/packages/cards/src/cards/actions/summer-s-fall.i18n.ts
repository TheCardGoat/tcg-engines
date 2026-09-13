import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { summerSFall } from "./summer-s-fall.ts";

export const summerSFallI18n = defineFamilyI18n(summerSFall, {
  en: {
    name: "Summer's Fall",
    text: "Decompose - When this attacks, you may banish 2 Earth cards and an action card from your graveyard. If you do, put up to 1 target aura on the bottom of its owner's deck.",
    typeText: "Earth Action - Attack",
  },
});

export const {
  red: summerSFallRedI18n,
  yellow: summerSFallYellowI18n,
  blue: summerSFallBlueI18n,
} = summerSFallI18n.cards;
