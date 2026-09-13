import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { hitAndRun } from "./hit-and-run.ts";

export const hitAndRunI18n = defineFamilyI18n(hitAndRun, {
  en: {
    name: "Hit and Run",
    text: (amount) =>
      `Your next weapon attack this turn gains go again.\nIf you have attacked with a weapon this turn, your next attack this turn gains +${amount}{p}.\nGo again`,
    typeText: "Warrior Action",
  },
});

export const {
  red: hitAndRunRedI18n,
  yellow: hitAndRunYellowI18n,
  blue: hitAndRunBlueI18n,
} = hitAndRunI18n.cards;
