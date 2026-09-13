import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { carveUp } from "./carve-up.ts";

export const carveUpI18n = defineFamilyI18n(carveUp, {
  en: {
    name: "Carve Up",
    typeText: "Warrior Attack Reaction",
    text: 'Target weapon attack gets "When this hits a hero, you may remove a +1{p} counter from this weapon. If you do, destroy a card in their arsenal."',
  },
});

export const { yellow: carveUpYellowI18n } = carveUpI18n.cards;
