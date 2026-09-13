import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { cosmicDuality } from "./cosmic-duality.ts";

export const cosmicDualityI18n = defineFamilyI18n(cosmicDuality, {
  en: {
    name: "Cosmic Duality",
    typeText: "Lightning Illusionist Action - Attack",
    text: "Instant - {r}, discard this: Deal 1 arcane damage to target hero. Create a Lightning Flow token.\nFragment",
  },
});

export const {
  red: cosmicDualityRedI18n,
  yellow: cosmicDualityYellowI18n,
  blue: cosmicDualityBlueI18n,
} = cosmicDualityI18n.cards;
