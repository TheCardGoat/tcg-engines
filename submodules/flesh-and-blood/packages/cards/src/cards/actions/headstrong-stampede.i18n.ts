import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { headstrongStampede } from "./headstrong-stampede.ts";

export const headstrongStampedeI18n = defineFamilyI18n(headstrongStampede, {
  en: {
    name: "Headstrong Stampede",
    text: "When this attacks, reveal the top card of your deck. If the revealed card has 6 or more base {p}, this gets **go again**.",
    typeText: "Brute Action - Attack",
  },
});

export const {
  red: headstrongStampedeRedI18n,
  yellow: headstrongStampedeYellowI18n,
  blue: headstrongStampedeBlueI18n,
} = headstrongStampedeI18n.cards;
