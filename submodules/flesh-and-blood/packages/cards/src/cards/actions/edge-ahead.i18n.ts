import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { edgeAhead } from "./edge-ahead.ts";

export const edgeAheadI18n = defineFamilyI18n(edgeAhead, {
  en: {
    name: "Edge Ahead",
    text: (amount) =>
      `Your next Warrior attack this turn gets +${amount}{p} and "When this attacks a hero, you may wager an Agility token with them."\nGo again`,
    typeText: "Warrior Action",
  },
});

export const {
  red: edgeAheadRedI18n,
  yellow: edgeAheadYellowI18n,
  blue: edgeAheadBlueI18n,
} = edgeAheadI18n.cards;
