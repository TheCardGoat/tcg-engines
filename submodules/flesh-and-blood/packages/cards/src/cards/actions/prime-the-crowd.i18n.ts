import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { primeTheCrowd } from "./prime-the-crowd.ts";

export const primeTheCrowdI18n = defineFamilyI18n(primeTheCrowd, {
  en: {
    name: "Prime the Crowd",
    typeText: "Generic Action",
    text: ({ powerBonus }) =>
      `The next attack action card you play this turn gets +${powerBonus}{p}.\nThe crowd cheers each Revered hero.\nThe crowd boos each Reviled hero.\nGo again`,
  },
});

export const {
  red: primeTheCrowdRedI18n,
  yellow: primeTheCrowdYellowI18n,
  blue: primeTheCrowdBlueI18n,
} = primeTheCrowdI18n.cards;
