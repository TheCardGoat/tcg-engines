import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { dumpsterDive } from "./dumpster-dive.ts";

export const dumpsterDiveI18n = defineFamilyI18n(dumpsterDive, {
  en: {
    name: "Dumpster Dive",
    text: "Boost\nIf an item or equipment was banished from boosting this, this gets +1{p}.",
    typeText: "Mechanologist Action - Attack",
  },
});

export const {
  red: dumpsterDiveRedI18n,
  yellow: dumpsterDiveYellowI18n,
  blue: dumpsterDiveBlueI18n,
} = dumpsterDiveI18n.cards;
