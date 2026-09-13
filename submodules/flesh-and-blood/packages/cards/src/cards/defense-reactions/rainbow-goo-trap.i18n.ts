import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { rainbowGooTrap } from "./rainbow-goo-trap.ts";

export const rainbowGooTrapI18n = defineFamilyI18n(rainbowGooTrap, {
  en: {
    name: "Rainbow Goo Trap",
    text: "When this defends an attack with {p} greater than its base, dominate, and go again, the attack gets -2{p} and loses and can't gain abilities.",
    typeText: "Ranger Defense Reaction - Trap",
  },
});

export const { red: rainbowGooTrapRedI18n } = rainbowGooTrapI18n.cards;
