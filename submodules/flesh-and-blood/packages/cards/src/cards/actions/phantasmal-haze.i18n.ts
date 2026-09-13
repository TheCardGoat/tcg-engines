import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { phantasmalHaze } from "./phantasmal-haze.ts";

export const phantasmalHazeI18n = defineFamilyI18n(phantasmalHaze, {
  en: {
    name: "Phantasmal Haze",
    typeText: "Illusionist Action - Attack",
    text: "Phantasm\nWhen Phantasmal Haze is destroyed, create a Spectral Shield token.",
  },
});

export const {
  red: phantasmalHazeRedI18n,
  yellow: phantasmalHazeYellowI18n,
  blue: phantasmalHazeBlueI18n,
} = phantasmalHazeI18n.cards;
