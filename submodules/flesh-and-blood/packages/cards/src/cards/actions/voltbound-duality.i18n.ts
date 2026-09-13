import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { voltboundDuality } from "./voltbound-duality.ts";

export const voltboundDualityI18n = defineFamilyI18n(voltboundDuality, {
  en: {
    name: "Voltbound Duality",
    text: "Instant - {r}, discard this: Deal 1 arcane damage to target hero. Create a Lightning Flow token.",
    typeText: "Lightning Runeblade Action - Attack",
  },
});

export const {
  red: voltboundDualityRedI18n,
  yellow: voltboundDualityYellowI18n,
  blue: voltboundDualityBlueI18n,
} = voltboundDualityI18n.cards;
