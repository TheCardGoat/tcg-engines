import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { soulButcher } from "./soul-butcher.ts";

export const soulButcherI18n = defineFamilyI18n(soulButcher, {
  en: {
    name: "Soul Butcher",
    text: "If the defending hero has 1 or more cards in their soul, this gets +2{p}.\nBlood Debt",
    typeText: "Shadow Action - Attack",
  },
});

export const {
  red: soulButcherRedI18n,
  yellow: soulButcherYellowI18n,
  blue: soulButcherBlueI18n,
} = soulButcherI18n.cards;
