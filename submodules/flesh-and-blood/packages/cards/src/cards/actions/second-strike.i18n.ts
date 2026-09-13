import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { secondStrike } from "./second-strike.ts";

export const secondStrikeI18n = defineFamilyI18n(secondStrike, {
  en: {
    name: "Second Strike",
    typeText: "Lightning Action - Attack",
    text: "When this attacks, if you've dealt damage this turn, this gets +1{p} and go again.",
  },
});

export const {
  red: secondStrikeRedI18n,
  yellow: secondStrikeYellowI18n,
  blue: secondStrikeBlueI18n,
} = secondStrikeI18n.cards;
