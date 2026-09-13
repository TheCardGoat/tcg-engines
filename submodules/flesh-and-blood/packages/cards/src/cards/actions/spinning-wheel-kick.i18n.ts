import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { spinningWheelKick } from "./spinning-wheel-kick.ts";

export const spinningWheelKickI18n = defineFamilyI18n(spinningWheelKick, {
  en: {
    name: "Spinning Wheel Kick",
    text: 'Combo - If Twin Twisters or Spinning Wheel Kick was the last attack this combat chain, this has +1{p} and "When this hits, put it on the bottom of its owner\'s deck."\nGo again',
    typeText: "Ninja Action - Attack",
  },
});

export const {
  red: spinningWheelKickRedI18n,
  yellow: spinningWheelKickYellowI18n,
  blue: spinningWheelKickBlueI18n,
} = spinningWheelKickI18n.cards;
