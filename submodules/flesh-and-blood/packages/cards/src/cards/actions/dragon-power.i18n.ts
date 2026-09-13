import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { dragonPower } from "./dragon-power.ts";

export const dragonPowerI18n = defineFamilyI18n(dragonPower, {
  en: {
    name: "Dragon Power",
    typeText: "Ninja Action - Attack",
    text: "When this attacks, if it is Draconic, it gets +3{p}.",
  },
});

export const {
  red: dragonPowerRedI18n,
  yellow: dragonPowerYellowI18n,
  blue: dragonPowerBlueI18n,
} = dragonPowerI18n.cards;
