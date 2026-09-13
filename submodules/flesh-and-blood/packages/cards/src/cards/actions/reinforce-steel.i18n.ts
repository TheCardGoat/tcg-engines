import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { reinforceSteel } from "./reinforce-steel.ts";

export const reinforceSteelI18n = defineFamilyI18n(reinforceSteel, {
  en: {
    name: "Reinforce Steel",
    text: ({ value1 }) =>
      `Remove a -1{d} counter from a Guardian off-hand you control with ${value1} or less base {d}.`,
    typeText: "Guardian Action",
  },
});

export const {
  red: reinforceSteelRedI18n,
  yellow: reinforceSteelYellowI18n,
  blue: reinforceSteelBlueI18n,
} = reinforceSteelI18n.cards;
