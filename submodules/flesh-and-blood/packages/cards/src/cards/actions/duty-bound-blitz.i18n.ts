import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { dutyBoundBlitz } from "./duty-bound-blitz.ts";

export const dutyBoundBlitzI18n = defineFamilyI18n(dutyBoundBlitz, {
  en: {
    name: "Duty Bound Blitz",
    typeText: "Light Action - Attack",
    text: "Play this only if a yellow card has been put into your soul this turn.\nGo again",
  },
});

export const {
  red: dutyBoundBlitzRedI18n,
  yellow: dutyBoundBlitzYellowI18n,
  blue: dutyBoundBlitzBlueI18n,
} = dutyBoundBlitzI18n.cards;
