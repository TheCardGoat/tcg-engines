import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { nimblism } from "./nimblism.ts";

export const nimblismI18n = defineFamilyI18n(nimblism, {
  en: {
    name: "Nimblism",
    typeText: "Generic Action",
    text: ({ powerBonus }) =>
      `The next attack action card with cost 1 or less you play this turn gains +${powerBonus}{p}.\nGo again`,
  },
});

export const {
  red: nimblismRedI18n,
  yellow: nimblismYellowI18n,
  blue: nimblismBlueI18n,
} = nimblismI18n.cards;
