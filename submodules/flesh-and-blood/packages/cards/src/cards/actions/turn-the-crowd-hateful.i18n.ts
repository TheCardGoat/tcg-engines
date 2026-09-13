import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { turnTheCrowdHateful } from "./turn-the-crowd-hateful.ts";

export const turnTheCrowdHatefulI18n = defineFamilyI18n(turnTheCrowdHateful, {
  en: {
    name: "Turn the Crowd Hateful",
    text: "When this attacks a Revered hero, this gets +3{p}.\nWhen this hits a Revered hero, the crowd boos you.",
    typeText: "Reviled Action - Attack",
  },
});
export const {
  red: turnTheCrowdHatefulRedI18n,
  yellow: turnTheCrowdHatefulYellowI18n,
  blue: turnTheCrowdHatefulBlueI18n,
} = turnTheCrowdHatefulI18n.cards;
