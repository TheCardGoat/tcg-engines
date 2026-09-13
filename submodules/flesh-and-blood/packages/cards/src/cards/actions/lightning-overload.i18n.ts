import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { lightningOverload } from "./lightning-overload.ts";

export const lightningOverloadI18n = defineFamilyI18n(lightningOverload, {
  en: {
    name: "Lightning Overload",
    text: (_parameter, color) =>
      `Deal ${color === "red" ? 4 : color === "yellow" ? 2 : 3} arcane damage to any target.\nStarfall - If an instant card has been put into your graveyard this turn, create a Lightning Flow token.`,
    typeText: "Lightning Wizard Action",
  },
});

export const {
  red: lightningOverloadRedI18n,
  yellow: lightningOverloadYellowI18n,
  blue: lightningOverloadBlueI18n,
} = lightningOverloadI18n.cards;
