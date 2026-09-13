import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { runThrough } from "./run-through.ts";

export const runThroughI18n = defineFamilyI18n(runThrough, {
  en: {
    name: "Run Through",
    typeText: "Warrior Attack Reaction",
    text: (amount) =>
      `Target sword attack gains go again.\nYour next sword attack this turn gets +${amount}{p}.`,
  },
});
export const {
  red: runThroughRedI18n,
  yellow: runThroughYellowI18n,
  blue: runThroughBlueI18n,
} = runThroughI18n.cards;
