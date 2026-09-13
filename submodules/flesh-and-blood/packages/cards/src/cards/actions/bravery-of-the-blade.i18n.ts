import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { braveryOfTheBlade } from "./bravery-of-the-blade.ts";

export const braveryOfTheBladeI18n = defineFamilyI18n(braveryOfTheBlade, {
  en: {
    name: "Bravery of the Blade",
    typeText: "Light Warrior Action - Attack",
    text: 'As an additional cost to play this, you may charge your soul.\nIf you\'ve charged this turn, this gets go again and "When this hits, create a Courage token."',
  },
});
export const { red: braveryOfTheBladeRedI18n } = braveryOfTheBladeI18n.cards;
