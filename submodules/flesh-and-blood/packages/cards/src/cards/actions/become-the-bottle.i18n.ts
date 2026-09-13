import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { becomeTheBottle } from "./become-the-bottle.ts";

export const becomeTheBottleI18n = defineFamilyI18n(becomeTheBottle, {
  en: {
    name: "Become the Bottle",
    typeText: "Ninja Action - Attack",
    text: "When this attacks, choose a card on the combat chain. This gets the chosen card's name.\nGo again",
  },
});

export const {
  red: becomeTheBottleRedI18n,
  yellow: becomeTheBottleYellowI18n,
  blue: becomeTheBottleBlueI18n,
} = becomeTheBottleI18n.cards;
