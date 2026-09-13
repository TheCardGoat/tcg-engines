import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { rallyTheCoastGuard } from "./rally-the-coast-guard.ts";

export const rallyTheCoastGuardI18n = defineFamilyI18n(rallyTheCoastGuard, {
  en: {
    name: "Rally the Coast Guard",
    text: "Once per Turn Instant - Discard a card: This gets +3{d}. Activate this only while this card is defending.",
    typeText: "Generic Action - Attack",
  },
});

export const {
  red: rallyTheCoastGuardRedI18n,
  yellow: rallyTheCoastGuardYellowI18n,
  blue: rallyTheCoastGuardBlueI18n,
} = rallyTheCoastGuardI18n.cards;
