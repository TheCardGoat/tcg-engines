import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { doubleTrouble } from "./double-trouble.ts";

export const doubleTroubleI18n = defineFamilyI18n(doubleTrouble, {
  en: {
    name: "Double Trouble",
    typeText: "Assassin Action - Attack",
    text: 'Stealth\nIf you\'ve played or activated 2 or more attack reactions this chain link, this gets +2{p} and "When this hits a hero, banish the top 2 cards of their deck."',
  },
});

export const {
  red: doubleTroubleRedI18n,
  yellow: doubleTroubleYellowI18n,
  blue: doubleTroubleBlueI18n,
} = doubleTroubleI18n.cards;
