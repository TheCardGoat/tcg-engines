import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { sloggism } from "./sloggism.ts";

export const sloggismI18n = defineFamilyI18n(sloggism, {
  en: {
    name: "Sloggism",
    typeText: "Generic Action",
    text: ({ powerBonus }) =>
      `The next attack action card with cost 2 or greater you play this turn gains +${powerBonus}{p}.\nGo again`,
  },
});

export const {
  red: sloggismRedI18n,
  yellow: sloggismYellowI18n,
  blue: sloggismBlueI18n,
} = sloggismI18n.cards;
