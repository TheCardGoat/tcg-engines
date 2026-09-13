import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { precisionPress } from "./precision-press.ts";

export const precisionPressI18n = defineFamilyI18n(precisionPress, {
  en: {
    name: "Precision Press",
    text: ({
      value1,
    }) => `Your next sword or dagger attack this turn has go again and piercing ${value1}.
Go again`,
    typeText: "Warrior Action",
  },
});

export const {
  red: precisionPressRedI18n,
  yellow: precisionPressYellowI18n,
  blue: precisionPressBlueI18n,
} = precisionPressI18n.cards;
