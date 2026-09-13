import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { bondsOfAttraction } from "./bonds-of-attraction.ts";

export const bondsOfAttractionI18n = defineFamilyI18n(bondsOfAttraction, {
  en: {
    name: "Bonds of Attraction",
    typeText: "Assassin Action - Attack",
    text: "Stealth\nWhen this hits a hero, banish the top card of their deck, then banish a card from their graveyard.\nWhenever this banishes a card and this has banished another card with the same color, gain 1{h}.",
  },
});

export const {
  red: bondsOfAttractionRedI18n,
  yellow: bondsOfAttractionYellowI18n,
  blue: bondsOfAttractionBlueI18n,
} = bondsOfAttractionI18n.cards;
