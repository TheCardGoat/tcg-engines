import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { rumblingOfIArathael } from "./rumbling-of-i-arathael.ts";

export const rumblingOfIArathaelI18n = defineFamilyI18n(rumblingOfIArathael, {
  en: {
    name: "Rumbling of i'Arathael",
    typeText: "Generic Action - Attack",
    text: "If a card has been put into your banished zone this turn, this gets overpower.",
  },
});

export const { red: rumblingOfIArathaelRedI18n } = rumblingOfIArathaelI18n.cards;
