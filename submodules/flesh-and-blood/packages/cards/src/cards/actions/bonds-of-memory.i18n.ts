import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { bondsOfMemory } from "./bonds-of-memory.ts";

export const bondsOfMemoryI18n = defineFamilyI18n(bondsOfMemory, {
  en: {
    name: "Bonds of Memory",
    typeText: "Assassin Action - Attack",
    text: "Stealth\nWhen this hits a hero, banish the top card of their deck, then banish a card from their graveyard.\nWhenever this banishes a card and this has banished another card with the same name, gain 1{h}.",
  },
});

export const {
  red: bondsOfMemoryRedI18n,
  yellow: bondsOfMemoryYellowI18n,
  blue: bondsOfMemoryBlueI18n,
} = bondsOfMemoryI18n.cards;
