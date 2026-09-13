import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { heavenSClaws } from "./heaven-s-claws.ts";

export const heavenSClawsI18n = defineFamilyI18n(heavenSClaws, {
  en: {
    name: "Heaven's Claws",
    typeText: "Lightning Action - Attack",
  },
});

export const {
  red: heavenSClawsRedI18n,
  yellow: heavenSClawsYellowI18n,
  blue: heavenSClawsBlueI18n,
} = heavenSClawsI18n.cards;
