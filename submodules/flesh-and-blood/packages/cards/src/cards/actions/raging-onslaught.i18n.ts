import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { ragingOnslaught } from "./raging-onslaught.ts";

export const ragingOnslaughtI18n = defineFamilyI18n(ragingOnslaught, {
  en: { name: "Raging Onslaught", typeText: "Generic Action - Attack" },
});

export const {
  red: ragingOnslaughtRedI18n,
  yellow: ragingOnslaughtYellowI18n,
  blue: ragingOnslaughtBlueI18n,
} = ragingOnslaughtI18n.cards;
