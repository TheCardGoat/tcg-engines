import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { intimateInducement } from "./intimate-inducement.ts";

export const intimateInducementI18n = defineFamilyI18n(intimateInducement, {
  en: {
    name: "Intimate Inducement",
    typeText: "Mystic Assassin Attack Reaction",
    text: (amount) =>
      `Target Assassin or Mystic attack action card gets +1{p}. Look at the top ${amount} cards of the defending hero's deck and choose a card. If it's blue, it has 0 base {d}. Put the chosen card onto the active chain link as a defending card and the rest on top in any order.`,
  },
});
export const {
  red: intimateInducementRedI18n,
  yellow: intimateInducementYellowI18n,
  blue: intimateInducementBlueI18n,
} = intimateInducementI18n.cards;
