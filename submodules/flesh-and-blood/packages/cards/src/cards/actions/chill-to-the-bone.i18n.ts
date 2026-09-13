import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { chillToTheBone } from "./chill-to-the-bone.ts";

export const chillToTheBoneI18n = defineFamilyI18n(chillToTheBone, {
  en: {
    name: "Chill to the Bone",
    text: ({ count }) =>
      `The next time an Ice or Elemental attack hits a hero this turn, create ${count} Frostbite tokens under their control.`,
    typeText: "Ice Action",
  },
});

export const {
  red: chillToTheBoneRedI18n,
  yellow: chillToTheBoneYellowI18n,
  blue: chillToTheBoneBlueI18n,
} = chillToTheBoneI18n.cards;
