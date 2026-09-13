import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { growClaws } from "./grow-claws.ts";

export const growClawsI18n = defineFamilyI18n(growClaws, {
  en: {
    name: "Grow Claws",
    typeText: "Ninja Action - Attack",
    text: "If a Draconic attack was the last attack this combat chain, this gets +1{p}.\nGo again",
  },
});

export const {
  red: growClawsRedI18n,
  yellow: growClawsYellowI18n,
  blue: growClawsBlueI18n,
} = growClawsI18n.cards;
