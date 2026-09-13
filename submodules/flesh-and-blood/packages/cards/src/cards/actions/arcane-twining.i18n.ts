import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { arcaneTwining } from "./arcane-twining.ts";

export const arcaneTwiningI18n = defineFamilyI18n(arcaneTwining, {
  en: {
    name: "Arcane Twining",
    text: ({ damage }) =>
      `Deal ${damage} arcane damage to any target.\nInstant - Discard this: Amp 1`,
    typeText: "Wizard Action",
  },
});

export const {
  red: arcaneTwiningRedI18n,
  yellow: arcaneTwiningYellowI18n,
  blue: arcaneTwiningBlueI18n,
} = arcaneTwiningI18n.cards;
