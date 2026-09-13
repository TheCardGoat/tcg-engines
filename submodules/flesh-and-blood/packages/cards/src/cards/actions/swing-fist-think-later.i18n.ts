import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { swingFistThinkLater } from "./swing-fist-think-later.ts";

export const swingFistThinkLaterI18n = defineFamilyI18n(swingFistThinkLater, {
  en: {
    name: "Swing Fist, Think Later",
    text: "As an additional cost to play Swing Fist, Think Later, discard a random card.\nGo again",
    typeText: "Brute Action - Attack",
  },
});

export const {
  red: swingFistThinkLaterRedI18n,
  yellow: swingFistThinkLaterYellowI18n,
  blue: swingFistThinkLaterBlueI18n,
} = swingFistThinkLaterI18n.cards;
