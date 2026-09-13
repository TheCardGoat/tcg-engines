import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { rightBehindYou } from "./right-behind-you.ts";

export const rightBehindYouI18n = defineFamilyI18n(rightBehindYou, {
  en: {
    name: "Right Behind You",
    text: "When this defends together with another card from hand, this gets +1{d} and you may look at the top card of your deck. You may put it on the bottom.",
    typeText: "Generic Action - Attack",
  },
});

export const {
  red: rightBehindYouRedI18n,
  yellow: rightBehindYouYellowI18n,
  blue: rightBehindYouBlueI18n,
} = rightBehindYouI18n.cards;
