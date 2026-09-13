import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { murmurOfIArathael } from "./murmur-of-i-arathael.ts";

export const murmurOfIArathaelI18n = defineFamilyI18n(murmurOfIArathael, {
  en: {
    name: "Murmur of i'Arathael",
    typeText: "Generic Action - Attack",
    text: "If a card has been put into your banished zone this turn, this gets go again.",
  },
});

export const { red: murmurOfIArathaelRedI18n } = murmurOfIArathaelI18n.cards;
