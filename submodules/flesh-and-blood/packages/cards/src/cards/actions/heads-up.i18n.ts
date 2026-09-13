import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { headsUp } from "./heads-up.ts";

export const headsUpI18n = defineFamilyI18n(headsUp, {
  en: {
    name: "Heads Up",
    typeText: "Warrior Action",
    text: 'Your next sword attack this turn gets +3{p} and "When this attacks, if it wagered, it gets dominate."\nGo again',
  },
});

export const { red: headsUpRedI18n } = headsUpI18n.cards;
