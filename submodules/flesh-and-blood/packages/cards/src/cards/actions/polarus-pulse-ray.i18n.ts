import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { polarusPulseRay } from "./polarus-pulse-ray.ts";

export const polarusPulseRayI18n = defineFamilyI18n(polarusPulseRay, {
  en: {
    name: "Polarus Pulse Ray",
    typeText: "Lightning Illusionist Action - Attack",
    text: "Whenever this fragments, deal 1 arcane damage to the defending hero.\nFragment",
  },
});

export const {
  red: polarusPulseRayRedI18n,
  yellow: polarusPulseRayYellowI18n,
  blue: polarusPulseRayBlueI18n,
} = polarusPulseRayI18n.cards;
