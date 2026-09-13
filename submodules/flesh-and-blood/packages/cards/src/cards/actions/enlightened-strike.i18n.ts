import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { enlightenedStrike } from "./enlightened-strike.ts";

const enlightenedStrikeI18n = defineFamilyI18n(enlightenedStrike, {
  en: {
    name: "Enlightened Strike",
    text: "As an additional cost to play Enlightened Strike, put a card from your hand on the bottom of your deck.\nChoose 1;\n- When you attack with Enlightened Strike, draw a card.\n- Enlightened Strike gains +2{p}.\n- Enlightened Strike gains go again.",
    typeText: "Generic Action - Attack",
    abilities: {
      asAdditionalCostPlayEnlightenedStrikePutFromHand: {
        modes: {
          whenAttackEnlightenedStrikeDraw: "When this attacks, draw a card.",
          enlightenedStrikeGains2: "This gains +2{p}.",
          enlightenedStrikeGainsGoAgain: "This gains go again.",
        },
      },
    },
  },
});

export const { red: enlightenedStrikeRedI18n } = enlightenedStrikeI18n.cards;
