import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { pendulumTrap } from "./pendulum-trap.ts";

export const pendulumTrapI18n = defineFamilyI18n(pendulumTrap, {
  en: {
    name: "Pendulum Trap",
    text: "When this defends and the attacking hero has played or activated a reaction this chain link, put the top 2 cards of their deck into their graveyard.",
    typeText: "Ranger Defense Reaction - Trap",
  },
});

export const { yellow: pendulumTrapYellowI18n } = pendulumTrapI18n.cards;
