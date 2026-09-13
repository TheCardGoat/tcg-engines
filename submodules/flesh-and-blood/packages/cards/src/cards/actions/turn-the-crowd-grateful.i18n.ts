import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { turnTheCrowdGrateful } from "./turn-the-crowd-grateful.ts";

export const turnTheCrowdGratefulI18n = defineFamilyI18n(turnTheCrowdGrateful, {
  en: {
    name: "Turn the Crowd Grateful",
    text: "When this attacks a Reviled hero, this gets +1{p}.\nWhen this hits a Reviled hero, the crowd cheers you.",
    typeText: "Revered Action - Attack",
  },
});
export const {
  red: turnTheCrowdGratefulRedI18n,
  yellow: turnTheCrowdGratefulYellowI18n,
  blue: turnTheCrowdGratefulBlueI18n,
} = turnTheCrowdGratefulI18n.cards;
