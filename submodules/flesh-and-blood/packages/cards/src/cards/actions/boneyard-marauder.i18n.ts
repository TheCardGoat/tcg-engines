import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { boneyardMarauder } from "./boneyard-marauder.ts";

export const boneyardMarauderI18n = defineFamilyI18n(boneyardMarauder, {
  en: {
    name: "Boneyard Marauder",
    text: "As an additional cost to play Boneyard Marauder, banish 3 random cards from your graveyard.\nBlood Debt",
    typeText: "Shadow Brute Action - Attack",
  },
});
export const {
  red: boneyardMarauderRedI18n,
  yellow: boneyardMarauderYellowI18n,
  blue: boneyardMarauderBlueI18n,
} = boneyardMarauderI18n.cards;
