import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { toughSmashup } from "./tough-smashup.ts";

export const toughSmashupI18n = defineFamilyI18n(toughSmashup, {
  en: {
    name: "Tough Smashup",
    text: "When this defends, clash with the attacking hero. The winner creates a Toughness token. You may put your revealed card on the bottom of its owner's deck.",
    typeText: "Revered Action - Attack",
  },
});
export const {
  red: toughSmashupRedI18n,
  yellow: toughSmashupYellowI18n,
  blue: toughSmashupBlueI18n,
} = toughSmashupI18n.cards;
