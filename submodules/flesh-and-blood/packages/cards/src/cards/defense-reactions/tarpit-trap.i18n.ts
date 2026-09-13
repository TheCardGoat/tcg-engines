import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { tarpitTrap } from "./tarpit-trap.ts";

export const tarpitTrapI18n = defineFamilyI18n(tarpitTrap, {
  en: {
    name: "Tarpit Trap",
    text: "When this defends an attack with go again, the next time an attack action card hits this turn, effects don't trigger.",
    typeText: "Ranger Defense Reaction - Trap",
  },
});

export const { yellow: tarpitTrapYellowI18n } = tarpitTrapI18n.cards;
