import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { quicksilverDance } from "./quicksilver-dance.ts";

export const quicksilverDanceI18n = defineFamilyI18n(quicksilverDance, {
  en: {
    name: "Quicksilver Dance",
    typeText: "Warrior Attack Reaction",
    text: "Remove a +1{p} counter from target attacking weapon. If you do, create a Blade Dance token and draw a card.",
  },
});

export const { blue: quicksilverDanceBlueI18n } = quicksilverDanceI18n.cards;
