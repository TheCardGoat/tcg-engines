import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { steelToTheDome } from "./steel-to-the-dome.ts";

export const steelToTheDomeI18n = defineFamilyI18n(steelToTheDome, {
  en: {
    name: "Steel to the Dome",
    typeText: "Warrior Action",
    text: 'Your next sword attack this turn gets +4{p} and "When this hits a Warrior hero, they discard a card."\nGo again',
  },
});

export const { red: steelToTheDomeRedI18n } = steelToTheDomeI18n.cards;
