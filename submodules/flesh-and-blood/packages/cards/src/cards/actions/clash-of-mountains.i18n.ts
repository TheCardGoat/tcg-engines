import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { clashOfMountains } from "./clash-of-mountains.ts";

export const clashOfMountainsI18n = defineFamilyI18n(clashOfMountains, {
  en: {
    name: "Clash of Mountains",
    text: "When this defends a Guardian attack, clash with the attacking hero. The winner creates a Seismic Surge token.",
    typeText: "Guardian Action - Attack",
  },
});

export const {
  red: clashOfMountainsRedI18n,
  yellow: clashOfMountainsYellowI18n,
  blue: clashOfMountainsBlueI18n,
} = clashOfMountainsI18n.cards;
