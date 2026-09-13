import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { snapShot } from "./snap-shot.ts";

export const snapShotI18n = defineFamilyI18n(snapShot, {
  en: {
    name: "Snap Shot",
    text: "Lightning Fusion\nIf Snap Shot was fused, you may activate abilities of bows you control an additional time this turn and as though they were an instant.",
    typeText: "Elemental Ranger Action - Arrow Attack",
  },
});

export const {
  red: snapShotRedI18n,
  yellow: snapShotYellowI18n,
  blue: snapShotBlueI18n,
} = snapShotI18n.cards;
