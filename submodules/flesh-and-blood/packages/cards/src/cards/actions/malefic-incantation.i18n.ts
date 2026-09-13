import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { maleficIncantation } from "./malefic-incantation.ts";

export const maleficIncantationI18n = defineFamilyI18n(maleficIncantation, {
  en: {
    name: "Malefic Incantation",
    text: (count) =>
      `Go again\nThis enters the arena with ${count === 1 ? "a verse counter" : count + " verse counters"}. When it has none, destroy it.\nOnce per turn, when you play an attack action card, remove a verse counter from this. If you do, create a Runechant token.`,
    typeText: "Runeblade Action - Aura",
  },
});

export const {
  red: maleficIncantationRedI18n,
  yellow: maleficIncantationYellowI18n,
  blue: maleficIncantationBlueI18n,
} = maleficIncantationI18n.cards;
