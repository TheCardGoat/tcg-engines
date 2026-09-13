import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { submerge } from "./submerge.ts";

export const submergeI18n = defineFamilyI18n(submerge, {
  en: {
    name: "Submerge",
    text: "As an additional cost to play this, put a card from your hand into your deck fifth from the top.",
    typeText: "Pirate Action - Attack",
  },
});
export const {
  red: submergeRedI18n,
  yellow: submergeYellowI18n,
  blue: submergeBlueI18n,
} = submergeI18n.cards;
