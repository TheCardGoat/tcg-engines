import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { boulderTrap } from "./boulder-trap.ts";

export const boulderTrapI18n = defineFamilyI18n(boulderTrap, {
  en: {
    name: "Boulder Trap",
    text: "When this defends an attack with {p} greater than its base, put a -1{d} counter on an equipment the attacking hero controls.",
    typeText: "Ranger Defense Reaction - Trap",
  },
});

export const { yellow: boulderTrapYellowI18n } = boulderTrapI18n.cards;
