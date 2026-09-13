import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { battlefieldBlitz } from "./battlefield-blitz.ts";

export const battlefieldBlitzI18n = defineFamilyI18n(battlefieldBlitz, {
  en: {
    name: "Battlefield Blitz",
    typeText: "Light Warrior Action - Attack",
    text: "If you've charged this turn, Battlefield Blitz gains go again.",
  },
});

export const {
  red: battlefieldBlitzRedI18n,
  yellow: battlefieldBlitzYellowI18n,
  blue: battlefieldBlitzBlueI18n,
} = battlefieldBlitzI18n.cards;
