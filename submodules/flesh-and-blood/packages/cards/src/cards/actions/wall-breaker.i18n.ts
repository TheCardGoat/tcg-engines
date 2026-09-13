import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { wallBreaker } from "./wall-breaker.ts";

export const wallBreakerI18n = defineFamilyI18n(wallBreaker, {
  en: {
    name: "Wall Breaker",
    text: "If you've banished a card with 6 or more {p} this turn, this gets overpower.\nBlood Debt",
    typeText: "Shadow Brute Action - Attack",
  },
});
export const {
  red: wallBreakerRedI18n,
  yellow: wallBreakerYellowI18n,
  blue: wallBreakerBlueI18n,
} = wallBreakerI18n.cards;
