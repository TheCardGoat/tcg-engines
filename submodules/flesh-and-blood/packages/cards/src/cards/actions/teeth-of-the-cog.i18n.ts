import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { teethOfTheCog } from "./teeth-of-the-cog.ts";

export const teethOfTheCogI18n = defineFamilyI18n(teethOfTheCog, {
  en: {
    name: "Teeth of the Cog",
    text: "Galvanize - When this defends, you may destroy an item you control. If you do, create a Golden Cog token.",
    typeText: "Mechanologist Action - Attack",
  },
});

export const {
  red: teethOfTheCogRedI18n,
  yellow: teethOfTheCogYellowI18n,
  blue: teethOfTheCogBlueI18n,
} = teethOfTheCogI18n.cards;
