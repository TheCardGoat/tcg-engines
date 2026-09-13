import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { gleamOfTheBlade } from "./gleam-of-the-blade.ts";

export const gleamOfTheBladeI18n = defineFamilyI18n(gleamOfTheBlade, {
  en: {
    name: "Gleam of the Blade",
    typeText: "Warrior Attack Reaction",
    text: "Target weapon attack gets +3{p}.\nInstant - Discard this: Create a Flurry token.",
  },
});

export const { red: gleamOfTheBladeRedI18n } = gleamOfTheBladeI18n.cards;
