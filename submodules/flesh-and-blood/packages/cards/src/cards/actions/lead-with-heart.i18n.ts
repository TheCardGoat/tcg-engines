import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { leadWithHeart } from "./lead-with-heart.ts";

export const leadWithHeartI18n = defineFamilyI18n(leadWithHeart, {
  en: {
    name: "Lead with Heart",
    text: (amount) =>
      `Your next Guardian or Warrior attack this turn gets +${amount}{p}.\nCreate a Vigor token.\nGo again`,
    typeText: "Guardian / Warrior Action",
  },
});

export const {
  red: leadWithHeartRedI18n,
  yellow: leadWithHeartYellowI18n,
  blue: leadWithHeartBlueI18n,
} = leadWithHeartI18n.cards;
