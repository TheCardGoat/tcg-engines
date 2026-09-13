import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { outlandSkirmish } from "./outland-skirmish.ts";

export const outlandSkirmishI18n = defineFamilyI18n(outlandSkirmish, {
  en: {
    name: "Outland Skirmish",
    text: ({ value1 }) => `Your next 1H weapon attack this turn gains +${value1}{p}.
The next time a weapon hits this turn, create a Copper token.
Go again`,
    typeText: "Warrior Action",
  },
});

export const {
  red: outlandSkirmishRedI18n,
  yellow: outlandSkirmishYellowI18n,
  blue: outlandSkirmishBlueI18n,
} = outlandSkirmishI18n.cards;
