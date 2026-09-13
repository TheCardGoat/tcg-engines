import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { soulCleaver } from "./soul-cleaver.ts";

export const soulCleaverI18n = defineFamilyI18n(soulCleaver, {
  en: {
    name: "Soul Cleaver",
    text: "If the defending hero has 1 or more cards in their soul, this gets go again.\nBlood Debt",
    typeText: "Shadow Action - Attack",
  },
});

export const {
  red: soulCleaverRedI18n,
  yellow: soulCleaverYellowI18n,
  blue: soulCleaverBlueI18n,
} = soulCleaverI18n.cards;
