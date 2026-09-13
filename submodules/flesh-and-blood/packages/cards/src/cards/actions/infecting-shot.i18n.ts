import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { infectingShot } from "./infecting-shot.ts";

export const infectingShotI18n = defineFamilyI18n(infectingShot, {
  en: {
    name: "Infecting Shot",
    typeText: "Ranger Action - Arrow Attack",
    text: "If Infecting Shot has an aim counter, it has +1{p}.\nWhen this hits a hero, create a Bloodrot Pox token under their control.",
  },
});

export const {
  red: infectingShotRedI18n,
  yellow: infectingShotYellowI18n,
  blue: infectingShotBlueI18n,
} = infectingShotI18n.cards;
