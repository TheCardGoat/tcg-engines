import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { riseToTheChallenge } from "./rise-to-the-challenge.ts";

export const riseToTheChallengeI18n = defineFamilyI18n(riseToTheChallenge, {
  en: {
    name: "Rise to the Challenge",
    typeText: "Brute Block",
    text: "When this defends, reveal the top card of your deck. If the revealed card has 6 or more base {p}, this gets +2{d}. Otherwise, put the revealed card on the bottom.\nInstant - Discard this: Your next attack this turn gets +2{p}.",
  },
});

export const {
  red: riseToTheChallengeRedI18n,
  yellow: riseToTheChallengeYellowI18n,
  blue: riseToTheChallengeBlueI18n,
} = riseToTheChallengeI18n.cards;
