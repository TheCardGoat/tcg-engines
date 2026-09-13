import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { arcanePolarity } from "./arcane-polarity.ts";

export const arcanePolarityI18n = defineFamilyI18n(arcanePolarity, {
  en: {
    name: "Arcane Polarity",
    typeText: "Generic Instant",
    text: (amount) =>
      `Gain 1{h}\nIf you've been dealt arcane damage this turn, instead gain ${amount}{h}.`,
  },
});

export const {
  red: arcanePolarityRedI18n,
  yellow: arcanePolarityYellowI18n,
  blue: arcanePolarityBlueI18n,
} = arcanePolarityI18n.cards;
