import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { pullFromBeyond } from "./pull-from-beyond.ts";

export const pullFromBeyondI18n = defineFamilyI18n(pullFromBeyond, {
  en: {
    name: "Pull from Beyond",
    text: ({ color }) => `Opt 2
Banish the top card of your deck. If it's ${color}, create a Gate to i'Arathael token. Go again`,
    typeText: "Shadow Action",
  },
});

export const {
  red: pullFromBeyondRedI18n,
  yellow: pullFromBeyondYellowI18n,
  blue: pullFromBeyondBlueI18n,
} = pullFromBeyondI18n.cards;
