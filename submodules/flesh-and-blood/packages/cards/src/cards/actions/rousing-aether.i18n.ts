import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { rousingAether } from "./rousing-aether.ts";

export const rousingAetherI18n = defineFamilyI18n(rousingAether, {
  en: {
    name: "Rousing Aether",
    text: ({ damage }) =>
      `Deal ${damage} arcane damage to target hero.\nThe next card you play this turn with an effect that deals arcane damage, instead deals that much arcane damage plus 1.`,
    typeText: "Wizard Action",
  },
});

export const {
  red: rousingAetherRedI18n,
  yellow: rousingAetherYellowI18n,
  blue: rousingAetherBlueI18n,
} = rousingAetherI18n.cards;
