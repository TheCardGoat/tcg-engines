import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { bladeRunner } from "./blade-runner.ts";

export const bladeRunnerI18n = defineFamilyI18n(bladeRunner, {
  en: {
    name: "Blade Runner",
    typeText: "Warrior Attack Reaction",
    text: (amount) =>
      `Target 1H weapon attack gains go again.\nYour next weapon attack this turn gains +${amount}{p}.`,
  },
});
export const {
  red: bladeRunnerRedI18n,
  yellow: bladeRunnerYellowI18n,
  blue: bladeRunnerBlueI18n,
} = bladeRunnerI18n.cards;
