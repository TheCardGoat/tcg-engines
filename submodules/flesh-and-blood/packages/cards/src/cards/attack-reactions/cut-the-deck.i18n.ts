import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { cutTheDeck } from "./cut-the-deck.ts";

export const cutTheDeckI18n = defineFamilyI18n(cutTheDeck, {
  en: {
    name: "Cut the Deck",
    typeText: "Warrior Attack Reaction",
    text: (amount) =>
      `Target Warrior attack gets +${amount}{p}. If it's defended by an attack action card, draw a card, then put a card from your hand or arsenal on the bottom of your deck.`,
  },
});
export const {
  red: cutTheDeckRedI18n,
  yellow: cutTheDeckYellowI18n,
  blue: cutTheDeckBlueI18n,
} = cutTheDeckI18n.cards;
