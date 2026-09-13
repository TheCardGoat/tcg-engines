import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { restBeforeBattle } from "./rest-before-battle.ts";

export const restBeforeBattleI18n = defineFamilyI18n(restBeforeBattle, {
  en: {
    name: "Rest Before Battle",
    typeText: "Warrior Action - Aura",
    text: "Play this only if you've attacked with a weapon this turn.\nAt the start of your turn, destroy this and draw a card.",
  },
});

export const { yellow: restBeforeBattleYellowI18n } = restBeforeBattleI18n.cards;
