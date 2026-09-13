import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { biggerThanBig } from "./bigger-than-big.ts";

export const biggerThanBigI18n = defineFamilyI18n(biggerThanBig, {
  en: {
    name: "Bigger Than Big",
    text: (amount) =>
      `At the start of your turn, destroy this, then your next Guardian attack this turn gets +${amount}{p} and "When this attacks a hero, you may wager a Might token with them."`,
    typeText: "Guardian Action - Aura",
  },
});

export const {
  red: biggerThanBigRedI18n,
  yellow: biggerThanBigYellowI18n,
  blue: biggerThanBigBlueI18n,
} = biggerThanBigI18n.cards;
