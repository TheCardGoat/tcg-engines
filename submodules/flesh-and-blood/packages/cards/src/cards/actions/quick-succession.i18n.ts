import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { quickSuccession } from "./quick-succession.ts";

export const quickSuccessionI18n = defineFamilyI18n(quickSuccession, {
  en: {
    name: "Quick Succession",
    text: ({ attacks }, color) =>
      color === "blue"
        ? `The next Runeblade or Lightning attack action card you play this turn gets go again.\nYour next attack this turn get +1{p} while it has go again.\nGo again`
        : `The next Runeblade or Lightning attack action card you play this turn gets go again.\nYour next ${attacks} attacks this turn get +1{p} while they have go again.\nGo again`,
    typeText: "Lightning Runeblade Action",
  },
});

export const {
  red: quickSuccessionRedI18n,
  yellow: quickSuccessionYellowI18n,
  blue: quickSuccessionBlueI18n,
} = quickSuccessionI18n.cards;
