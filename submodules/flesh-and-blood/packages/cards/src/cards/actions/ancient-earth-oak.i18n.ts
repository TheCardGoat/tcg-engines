import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { ancientEarthOak } from "./ancient-earth-oak.ts";

export const ancientEarthOakI18n = defineFamilyI18n(ancientEarthOak, {
  en: {
    name: "Ancient Earth Oak",
    typeText: "Ice Action - Attack",
    text: 'When this hits a hero, create a Frostbite token under their control.\nEarth Bond - If an Earth card was pitched to play this, this gets +2{p} and "When this hits a hero, put this on the bottom of its owner\'s deck."',
  },
});

export const { red: ancientEarthOakRedI18n } = ancientEarthOakI18n.cards;
