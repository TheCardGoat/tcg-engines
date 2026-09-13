import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { sliceAndDice } from "./slice-and-dice.ts";

export const sliceAndDiceI18n = defineFamilyI18n(sliceAndDice, {
  en: {
    name: "Slice and Dice",
    text: ({ value1 }) => `Whenever you attack with a sword or dagger this turn;

If it's your first weapon attack this turn, it gains +1{p}.
If it's your second weapon attack this turn, it gains +${value1}{p}.

Go again`,
    typeText: "Warrior Action",
  },
});

export const {
  red: sliceAndDiceRedI18n,
  yellow: sliceAndDiceYellowI18n,
  blue: sliceAndDiceBlueI18n,
} = sliceAndDiceI18n.cards;
