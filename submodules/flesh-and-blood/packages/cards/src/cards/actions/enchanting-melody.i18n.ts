import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { enchantingMelody } from "./enchanting-melody.ts";

export const enchantingMelodyI18n = defineFamilyI18n(enchantingMelody, {
  en: {
    name: "Enchanting Melody",
    typeText: "Generic Action - Aura",
    text: ({ preventionAmount }) =>
      `Go again\nIf your hero would be dealt damage, instead destroy Enchanting Melody and prevent ${preventionAmount} damage that source would deal.\nAt the beginning of your end phase, destroy Enchanting Melody unless you have played a 'non-attack' action card this turn.`,
  },
});

export const {
  red: enchantingMelodyRedI18n,
  yellow: enchantingMelodyYellowI18n,
  blue: enchantingMelodyBlueI18n,
} = enchantingMelodyI18n.cards;
