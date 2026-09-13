import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { boltOfCourage } from "./bolt-of-courage.ts";

export const boltOfCourageI18n = defineFamilyI18n(boltOfCourage, {
  en: {
    name: "Bolt of Courage",
    typeText: "Light Warrior Action - Attack",
    text: "As an additional cost to play Bolt of Courage, you may charge your hero's soul.\nIf you've charged this turn, Bolt of Courage gains \"If this hits, draw a card.\"",
  },
});

export const {
  red: boltOfCourageRedI18n,
  yellow: boltOfCourageYellowI18n,
  blue: boltOfCourageBlueI18n,
} = boltOfCourageI18n.cards;
