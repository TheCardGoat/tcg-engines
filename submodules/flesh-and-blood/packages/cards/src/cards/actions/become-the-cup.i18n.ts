import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { becomeTheCup } from "./become-the-cup.ts";

export const becomeTheCupI18n = defineFamilyI18n(becomeTheCup, {
  en: {
    name: "Become the Cup",
    typeText: "Ninja Action - Attack",
    text: "As you play this, choose a color. This gets the chosen color.\nGo again",
  },
});

export const {
  red: becomeTheCupRedI18n,
  yellow: becomeTheCupYellowI18n,
  blue: becomeTheCupBlueI18n,
} = becomeTheCupI18n.cards;
