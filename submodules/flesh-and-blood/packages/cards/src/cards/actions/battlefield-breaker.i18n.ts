import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { battlefieldBreaker } from "./battlefield-breaker.ts";

export const battlefieldBreakerI18n = defineFamilyI18n(battlefieldBreaker, {
  en: {
    name: "Battlefield Breaker",
    text: "If you've banished a card with 6 or more {p} this turn, this gets +1{p}.\nBlood Debt",
    typeText: "Shadow Brute Action - Attack",
  },
});
export const {
  red: battlefieldBreakerRedI18n,
  yellow: battlefieldBreakerYellowI18n,
  blue: battlefieldBreakerBlueI18n,
} = battlefieldBreakerI18n.cards;
