import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { frailtyTrap } from "./frailty-trap.ts";

export const frailtyTrapI18n = defineFamilyI18n(frailtyTrap, {
  en: {
    name: "Frailty Trap",
    text: "When this defends an attack with go again, create a Frailty token under the attacking hero's control.",
    typeText: "Assassin / Ranger Defense Reaction - Trap",
  },
});

export const { red: frailtyTrapRedI18n } = frailtyTrapI18n.cards;
