import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { promiseOfPower } from "./promise-of-power.ts";

export const promiseOfPowerI18n = defineFamilyI18n(promiseOfPower, {
  en: {
    name: "Promise of Power",
    typeText: "Shadow Runeblade Action",
    text: "The next time you play an attack action card from your banished zone this turn, create 2 Runechant tokens.\nGo again",
  },
});

export const { yellow: promiseOfPowerYellowI18n } = promiseOfPowerI18n.cards;
