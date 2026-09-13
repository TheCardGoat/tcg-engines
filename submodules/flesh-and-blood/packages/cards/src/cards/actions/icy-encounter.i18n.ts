import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { icyEncounter } from "./icy-encounter.ts";

export const icyEncounterI18n = defineFamilyI18n(icyEncounter, {
  en: {
    name: "Icy Encounter",
    text: "If Icy Encounter hits a hero, create a Frostbite token under their control.",
    typeText: "Ice Action - Attack",
  },
});

export const {
  red: icyEncounterRedI18n,
  yellow: icyEncounterYellowI18n,
  blue: icyEncounterBlueI18n,
} = icyEncounterI18n.cards;
