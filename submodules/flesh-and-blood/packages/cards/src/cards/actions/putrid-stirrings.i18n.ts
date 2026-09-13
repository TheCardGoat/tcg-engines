import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { putridStirrings } from "./putrid-stirrings.ts";

export const putridStirringsI18n = defineFamilyI18n(putridStirrings, {
  en: {
    name: "Putrid Stirrings",
    text: (amount) =>
      `You may play this from your banished zone.\nThe next attack action card you rune gate this turn gets +${amount}{p}.\nGo again\nBlood debt`,
    typeText: "Shadow Runeblade Action",
  },
});

export const {
  red: putridStirringsRedI18n,
  yellow: putridStirringsYellowI18n,
  blue: putridStirringsBlueI18n,
} = putridStirringsI18n.cards;
