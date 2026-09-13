import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { heavySwing } from "./heavy-swing.ts";

export const heavySwingI18n = defineFamilyI18n(heavySwing, {
  en: {
    name: "Heavy Swing",
    typeText: "Warrior Action - Aura",
    text: "At the start of your turn, destroy this and your next sword attack this turn gets +3{p}.",
  },
});

export const { red: heavySwingRedI18n } = heavySwingI18n.cards;
