import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { madcapMuscle } from "./madcap-muscle.ts";

export const madcapMuscleI18n = defineFamilyI18n(madcapMuscle, {
  en: {
    name: "Madcap Muscle",
    text: "As an additional cost to play Madcap Muscle, discard a random card.\nIf the discarded card has 6 or more {p}, Madcap Muscle has +3{p}.",
    typeText: "Brute Action - Attack",
  },
});

export const {
  red: madcapMuscleRedI18n,
  yellow: madcapMuscleYellowI18n,
  blue: madcapMuscleBlueI18n,
} = madcapMuscleI18n.cards;
