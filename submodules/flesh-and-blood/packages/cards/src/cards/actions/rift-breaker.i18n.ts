import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { riftBreaker } from "./rift-breaker.ts";

export const riftBreakerI18n = defineFamilyI18n(riftBreaker, {
  en: {
    name: "Rift Breaker",
    typeText: "Lightning Action - Attack",
    text: "When this hits a hero, destroy a Lightning Flow token they control.",
  },
});

export const {
  red: riftBreakerRedI18n,
  yellow: riftBreakerYellowI18n,
  blue: riftBreakerBlueI18n,
} = riftBreakerI18n.cards;
