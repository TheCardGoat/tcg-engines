import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { runebloodIncantation } from "./runeblood-incantation.ts";

export const runebloodIncantationI18n = defineFamilyI18n(runebloodIncantation, {
  en: {
    name: "Runeblood Incantation",
    text: (count) =>
      `Go again\nRuneblood Incantation enters the arena with ${count === 1 ? "a verse counter" : count + " verse counters"} on it.\nAt the beginning of your action phase, remove a verse counter from Runeblood Incantation. If you do create a Runechant token. Otherwise, destroy Runeblood Incantation.`,
    typeText: "Runeblade Action - Aura",
  },
});

export const {
  red: runebloodIncantationRedI18n,
  yellow: runebloodIncantationYellowI18n,
  blue: runebloodIncantationBlueI18n,
} = runebloodIncantationI18n.cards;
