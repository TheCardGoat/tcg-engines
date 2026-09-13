import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { ferventForerunner } from "./fervent-forerunner.ts";

export const ferventForerunnerI18n = defineFamilyI18n(ferventForerunner, {
  en: {
    name: "Fervent Forerunner",
    typeText: "Generic Action - Attack",
    text: "If Fervent Forerunner hits, opt 2.\\nIf Fervent Forerunner is played from arsenal, it gains go again.",
  },
});

export const {
  red: ferventForerunnerRedI18n,
  yellow: ferventForerunnerYellowI18n,
  blue: ferventForerunnerBlueI18n,
} = ferventForerunnerI18n.cards;
