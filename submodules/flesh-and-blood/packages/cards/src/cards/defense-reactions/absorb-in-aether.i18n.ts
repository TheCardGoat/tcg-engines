import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { absorbInAether } from "./absorb-in-aether.ts";

export const absorbInAetherI18n = defineFamilyI18n(absorbInAether, {
  en: {
    name: "Absorb in Aether",
    text: "The next card you play this turn with an effect that deals arcane damage, instead deals that much arcane damage plus 2.",
    typeText: "Wizard Defense Reaction",
  },
});

export const {
  red: absorbInAetherRedI18n,
  yellow: absorbInAetherYellowI18n,
  blue: absorbInAetherBlueI18n,
} = absorbInAetherI18n.cards;
