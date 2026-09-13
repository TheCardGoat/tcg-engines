import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { rallyTheRearguard } from "./rally-the-rearguard.ts";

export const rallyTheRearguardI18n = defineFamilyI18n(rallyTheRearguard, {
  en: {
    name: "Rally the Rearguard",
    text: "Once per Turn Instant - Discard a card: This gets +3{d}. Activate this ability only while this is defending.",
    typeText: "Generic Action - Attack",
  },
});
export const {
  red: rallyTheRearguardRedI18n,
  yellow: rallyTheRearguardYellowI18n,
  blue: rallyTheRearguardBlueI18n,
} = rallyTheRearguardI18n.cards;
