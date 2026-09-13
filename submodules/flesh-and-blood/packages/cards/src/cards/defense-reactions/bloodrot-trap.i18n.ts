import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { bloodrotTrap } from "./bloodrot-trap.ts";

export const bloodrotTrapI18n = defineFamilyI18n(bloodrotTrap, {
  en: {
    name: "Bloodrot Trap",
    text: "When this defends and the attacking hero has played or activated a reaction this chain link, create a Bloodrot Pox token under their control.",
    typeText: "Assassin / Ranger Defense Reaction - Trap",
  },
});

export const { red: bloodrotTrapRedI18n } = bloodrotTrapI18n.cards;
