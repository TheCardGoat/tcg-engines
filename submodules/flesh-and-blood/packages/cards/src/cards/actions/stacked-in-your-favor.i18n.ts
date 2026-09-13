import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { stackedInYourFavor } from "./stacked-in-your-favor.ts";

export const stackedInYourFavorI18n = defineFamilyI18n(stackedInYourFavor, {
  en: {
    name: "Stacked in Your Favor",
    text: (amount) => `Go again
Your attack action cards get +${amount}{d} while defending.
At the start of your turn, destroy this, draw a card, then put a card from your hand on top of your deck.`,
    typeText: "Guardian Action - Aura",
  },
});

export const {
  red: stackedInYourFavorRedI18n,
  yellow: stackedInYourFavorYellowI18n,
  blue: stackedInYourFavorBlueI18n,
} = stackedInYourFavorI18n.cards;
