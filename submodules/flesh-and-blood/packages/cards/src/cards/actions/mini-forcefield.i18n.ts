import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { miniForcefield } from "./mini-forcefield.ts";

export const miniForcefieldI18n = defineFamilyI18n(miniForcefield, {
  en: {
    name: "Mini Forcefield",
    text: ({ value1 }) =>
      `Crank\nThis enters the arena with ${value1} steam counters. At the start of your turn, destroy this unless you remove a steam counter from it.\nWard X, where X is the number of steam counters on this.`,
    typeText: "Mechanologist Action - Item",
  },
});

export const {
  red: miniForcefieldRedI18n,
  yellow: miniForcefieldYellowI18n,
  blue: miniForcefieldBlueI18n,
} = miniForcefieldI18n.cards;
