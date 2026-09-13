import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { shockStriker } from "./shock-striker.ts";

export const shockStrikerI18n = defineFamilyI18n(shockStriker, {
  en: {
    name: "Shock Striker",
    typeText: "Lightning Action - Attack",
    text: 'Once per Turn Instant - {r}{r}: Shock Striker gains "If Shock Striker hits a hero, deal 1 damage to them."',
  },
});

export const {
  red: shockStrikerRedI18n,
  yellow: shockStrikerYellowI18n,
  blue: shockStrikerBlueI18n,
} = shockStrikerI18n.cards;
