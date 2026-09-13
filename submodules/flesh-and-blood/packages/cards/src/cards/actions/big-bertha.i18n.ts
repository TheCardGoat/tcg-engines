import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { bigBertha } from "./big-bertha.ts";

export const bigBerthaI18n = defineFamilyI18n(bigBertha, {
  en: {
    name: "Big Bertha",
    text: "Boost\nWhen this is banished from boosting, put a steam counter on a Hyper Driver you control.",
    typeText: "Mechanologist Action - Attack",
  },
});

export const {
  red: bigBerthaRedI18n,
  yellow: bigBerthaYellowI18n,
  blue: bigBerthaBlueI18n,
} = bigBerthaI18n.cards;
