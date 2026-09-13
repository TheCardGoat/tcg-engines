import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { gasUp } from "./gas-up.ts";

export const gasUpI18n = defineFamilyI18n(gasUp, {
  en: {
    name: "Gas Up",
    text: ({ value1 }) =>
      `The next attack you boost this turn gets +${value1}{p}.\nYou may put a Hyper Driver from your banished zone into the arena.\nGo again`,
    typeText: "Mechanologist Action",
  },
});

export const { red: gasUpRedI18n, yellow: gasUpYellowI18n, blue: gasUpBlueI18n } = gasUpI18n.cards;
