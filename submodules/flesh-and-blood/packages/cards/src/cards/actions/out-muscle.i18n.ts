import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { outMuscle } from "./out-muscle.ts";

export const outMuscleI18n = defineFamilyI18n(outMuscle, {
  en: {
    name: "Out Muscle",
    text: "While Out Muscle isn't defended by a card with equal or greater {p}, it has go again.",
    typeText: "Generic Action - Attack",
  },
});

export const {
  red: outMuscleRedI18n,
  yellow: outMuscleYellowI18n,
  blue: outMuscleBlueI18n,
} = outMuscleI18n.cards;
