import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { explodingAether } from "./exploding-aether.ts";

export const explodingAetherI18n = defineFamilyI18n(explodingAether, {
  en: {
    name: "Exploding Aether",
    text: ({ ampAmount }) => `Amp ${ampAmount}\nGo again`,
    typeText: "Wizard Action",
  },
});

export const {
  red: explodingAetherRedI18n,
  yellow: explodingAetherYellowI18n,
  blue: explodingAetherBlueI18n,
} = explodingAetherI18n.cards;
