import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { steelbladeShunt } from "./steelblade-shunt.ts";

export const steelbladeShuntI18n = defineFamilyI18n(steelbladeShunt, {
  en: {
    name: "Steelblade Shunt",
    text: "If Steelblade Shunt defends a weapon attack, deal 1 damage to the attacking hero.",
    typeText: "Warrior Defense Reaction",
  },
});

export const {
  red: steelbladeShuntRedI18n,
  yellow: steelbladeShuntYellowI18n,
  blue: steelbladeShuntBlueI18n,
} = steelbladeShuntI18n.cards;
