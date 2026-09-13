import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { feedingFrenzy } from "./feeding-frenzy.ts";

export const feedingFrenzyI18n = defineFamilyI18n(feedingFrenzy, {
  en: {
    name: "Feeding Frenzy",
    typeText: "Shadow Brute Action - Attack",
    text: "When this attacks, banish the top card of your deck.\nIf you've banished a card with 6 or more {p} this turn, this gets go again.\nBlood Debt",
  },
});

export const {
  red: feedingFrenzyRedI18n,
  yellow: feedingFrenzyYellowI18n,
  blue: feedingFrenzyBlueI18n,
} = feedingFrenzyI18n.cards;
