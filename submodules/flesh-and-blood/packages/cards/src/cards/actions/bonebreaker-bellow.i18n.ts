import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { bonebreakerBellow } from "./bonebreaker-bellow.ts";

export const bonebreakerBellowI18n = defineFamilyI18n(bonebreakerBellow, {
  en: {
    name: "Bonebreaker Bellow",
    text: ({ amount, chestAmount }) =>
      `Beat Chest\nYour next Brute attack this turn gains +${amount}{p}. If you've beaten chest this turn, instead it gains +${chestAmount}{p}.\nGo again`,
    typeText: "Brute Action",
  },
});

export const {
  red: bonebreakerBellowRedI18n,
  yellow: bonebreakerBellowYellowI18n,
  blue: bonebreakerBellowBlueI18n,
} = bonebreakerBellowI18n.cards;
