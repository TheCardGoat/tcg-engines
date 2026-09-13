import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { tensionInTheAir } from "./tension-in-the-air.ts";

export const tensionInTheAirI18n = defineFamilyI18n(tensionInTheAir, {
  en: {
    name: "Tension in the Air",
    typeText: "Guardian Instant - Aura",
    text: ({ amount }) =>
      `When this leaves the arena, your next attack this turn gets +${amount}{p}.`,
  },
});

export const {
  red: tensionInTheAirRedI18n,
  yellow: tensionInTheAirYellowI18n,
  blue: tensionInTheAirBlueI18n,
} = tensionInTheAirI18n.cards;
