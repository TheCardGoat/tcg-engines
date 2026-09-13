import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { bigBop } from "./big-bop.ts";

export const bigBopI18n = defineFamilyI18n(bigBop, {
  en: {
    name: "Big Bop",
    text: (amount) =>
      `At the start of your turn, destroy this, then your next Guardian attack this turn gets +${amount}{p} and "When this attacks a hero, you may wager a Vigor token with them."`,
    typeText: "Guardian Action - Aura",
  },
});

export const {
  red: bigBopRedI18n,
  yellow: bigBopYellowI18n,
  blue: bigBopBlueI18n,
} = bigBopI18n.cards;
