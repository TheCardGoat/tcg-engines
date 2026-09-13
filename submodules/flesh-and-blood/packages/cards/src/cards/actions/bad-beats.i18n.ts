import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { badBeats } from "./bad-beats.ts";

export const badBeatsI18n = defineFamilyI18n(badBeats, {
  en: {
    name: "Bad Beats",
    text: ({ result }) =>
      `Roll a 6 sided die. If the number rolled is ${result}, the next Brute attack action card you play this turn gains +5{p}.\nGo again`,
    typeText: "Brute Action",
  },
});

export const {
  red: badBeatsRedI18n,
  yellow: badBeatsYellowI18n,
  blue: badBeatsBlueI18n,
} = badBeatsI18n.cards;
