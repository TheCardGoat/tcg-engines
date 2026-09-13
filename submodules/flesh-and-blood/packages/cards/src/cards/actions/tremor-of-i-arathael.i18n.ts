import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { tremorOfIArathael } from "./tremor-of-i-arathael.ts";

export const tremorOfIArathaelI18n = defineFamilyI18n(tremorOfIArathael, {
  en: {
    name: "Tremor of i'Arathael",
    text: "If a card has been put into your banished zone this turn, Tremor of i'Arathael gains +2{p}.",
    typeText: "Generic Action - Attack",
  },
});

export const {
  red: tremorOfIArathaelRedI18n,
  yellow: tremorOfIArathaelYellowI18n,
  blue: tremorOfIArathaelBlueI18n,
} = tremorOfIArathaelI18n.cards;
