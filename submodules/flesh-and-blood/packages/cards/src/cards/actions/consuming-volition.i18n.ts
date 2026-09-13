import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { consumingVolition } from "./consuming-volition.ts";

export const consumingVolitionI18n = defineFamilyI18n(consumingVolition, {
  en: {
    name: "Consuming Volition",
    text: 'If you\'ve dealt arcane damage this turn, this gets "When this hits a hero, they discard a card."',
    typeText: "Runeblade Action - Attack",
  },
});

export const {
  red: consumingVolitionRedI18n,
  yellow: consumingVolitionYellowI18n,
  blue: consumingVolitionBlueI18n,
} = consumingVolitionI18n.cards;
