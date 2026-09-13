import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { diceUp } from "./dice-up.ts";

export const diceUpI18n = defineFamilyI18n(diceUp, {
  en: {
    name: "Dice Up",
    typeText: "Warrior Attack Reaction",
    text: 'Target weapon attack gets "When this hits a hero, you may remove a +1{p} counter from this weapon. If you do, destroy an aura they control."',
  },
});

export const { blue: diceUpBlueI18n } = diceUpI18n.cards;
