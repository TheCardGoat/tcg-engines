import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { thunderQuake } from "./thunder-quake.ts";

export const thunderQuakeI18n = defineFamilyI18n(thunderQuake, {
  en: {
    name: "Thunder Quake",
    text: "Heave 3",
    typeText: "Guardian Action - Attack",
  },
});

export const {
  red: thunderQuakeRedI18n,
  yellow: thunderQuakeYellowI18n,
  blue: thunderQuakeBlueI18n,
} = thunderQuakeI18n.cards;
