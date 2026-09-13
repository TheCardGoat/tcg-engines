import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { falconWing } from "./falcon-wing.ts";

export const falconWingI18n = defineFamilyI18n(falconWing, {
  en: {
    name: "Falcon Wing",
    typeText: "Ranger Action - Arrow Attack",
    text: "If Falcon Wing has an aim counter, it has +1{p}.\nGo again",
  },
});

export const {
  red: falconWingRedI18n,
  yellow: falconWingYellowI18n,
  blue: falconWingBlueI18n,
} = falconWingI18n.cards;
