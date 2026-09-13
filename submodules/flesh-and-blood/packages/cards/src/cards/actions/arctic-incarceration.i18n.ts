import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { arcticIncarceration } from "./arctic-incarceration.ts";

export const arcticIncarcerationI18n = defineFamilyI18n(arcticIncarceration, {
  en: {
    name: "Arctic Incarceration",
    text: ({ count }) =>
      `Create ${count === 1 ? "a Frostbite token" : `${count} Frostbite tokens`} under target hero's control.`,
    typeText: "Ice Action",
  },
});

export const {
  red: arcticIncarcerationRedI18n,
  yellow: arcticIncarcerationYellowI18n,
  blue: arcticIncarcerationBlueI18n,
} = arcticIncarcerationI18n.cards;
