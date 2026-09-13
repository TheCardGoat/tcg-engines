import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { turnTimber } from "./turn-timber.ts";

export const turnTimberI18n = defineFamilyI18n(turnTimber, {
  en: {
    name: "Turn Timber",
    text: "Earth Fusion\nIf Turn Timber was fused, it gains +2{d}.",
    typeText: "Elemental Guardian Defense Reaction",
  },
});
export const {
  red: turnTimberRedI18n,
  yellow: turnTimberYellowI18n,
  blue: turnTimberBlueI18n,
} = turnTimberI18n.cards;
