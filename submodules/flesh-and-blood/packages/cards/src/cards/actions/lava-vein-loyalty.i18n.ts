import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { lavaVeinLoyalty } from "./lava-vein-loyalty.ts";

export const lavaVeinLoyaltyI18n = defineFamilyI18n(lavaVeinLoyalty, {
  en: {
    name: "Lava Vein Loyalty",
    text: "If you control 2 or more Draconic chain links, this gets go again.",
    typeText: "Draconic Ninja Action - Attack",
  },
});

export const {
  red: lavaVeinLoyaltyRedI18n,
  yellow: lavaVeinLoyaltyYellowI18n,
  blue: lavaVeinLoyaltyBlueI18n,
} = lavaVeinLoyaltyI18n.cards;
