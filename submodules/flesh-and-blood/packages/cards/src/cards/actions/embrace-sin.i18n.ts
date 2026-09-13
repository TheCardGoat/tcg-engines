import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { embraceSin } from "./embrace-sin.ts";

export const embraceSinI18n = defineFamilyI18n(embraceSin, {
  en: {
    name: "Embrace Sin",
    typeText: "Shadow Runeblade Action",
    text: "Your next attack this turn gets +2{p}.\nYou may play an aura with Runechant in its name from your banished zone this turn.\nGo again",
  },
});

export const { yellow: embraceSinYellowI18n } = embraceSinI18n.cards;
