import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { shieldBash } from "./shield-bash.ts";

export const shieldBashI18n = defineFamilyI18n(shieldBash, {
  en: {
    name: "Shield Bash",
    text: "If a Guardian off-hand with 1 or more {d} is defending this chain link, deal 1 damage to the attacking hero unless they discard a card.",
    typeText: "Guardian Defense Reaction",
  },
});

export const {
  red: shieldBashRedI18n,
  yellow: shieldBashYellowI18n,
  blue: shieldBashBlueI18n,
} = shieldBashI18n.cards;
