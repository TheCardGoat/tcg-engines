import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { twistAndTurn } from "./twist-and-turn.ts";

export const twistAndTurnI18n = defineFamilyI18n(twistAndTurn, {
  en: {
    name: "Twist and Turn",
    text: ({
      value1,
    }) => `Your next dagger attack this turn gets +${value1}{p} and "When this hits, you may attack with it an additional time this turn."
Go again`,
    typeText: "Warrior Action",
  },
});

export const {
  red: twistAndTurnRedI18n,
  yellow: twistAndTurnYellowI18n,
  blue: twistAndTurnBlueI18n,
} = twistAndTurnI18n.cards;
