import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { punchAboveYourWeight } from "./punch-above-your-weight.ts";

export const punchAboveYourWeightI18n = defineFamilyI18n(punchAboveYourWeight, {
  en: {
    name: "Punch Above Your Weight",
    text: ({ powerBonus }) =>
      `When this attacks, you may pay {r}{r}{r}. If you do, this gets +${powerBonus}{p}.`,
    typeText: "Generic Action - Attack",
  },
});

export const {
  red: punchAboveYourWeightRedI18n,
  yellow: punchAboveYourWeightYellowI18n,
  blue: punchAboveYourWeightBlueI18n,
} = punchAboveYourWeightI18n.cards;
