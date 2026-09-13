import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { trailblazingAether } from "./trailblazing-aether.ts";

export const trailblazingAetherI18n = defineFamilyI18n(trailblazingAether, {
  en: {
    name: "Trailblazing Aether",
    text: ({ damage }) =>
      `Deal ${damage} arcane damage to target hero.\nSurge - If this deals more than ${damage} damage, it gets go again.`,
    typeText: "Wizard Action",
  },
});

export const {
  red: trailblazingAetherRedI18n,
  yellow: trailblazingAetherYellowI18n,
  blue: trailblazingAetherBlueI18n,
} = trailblazingAetherI18n.cards;
