import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { crankshaft } from "./crankshaft.ts";

export const crankshaftI18n = defineFamilyI18n(crankshaft, {
  en: {
    name: "Crankshaft",
    text: "Boost\nWhen this is banished from boosting, put a steam counter on a Hyper Driver you control.",
    typeText: "Mechanologist Action - Attack",
  },
});

export const {
  red: crankshaftRedI18n,
  yellow: crankshaftYellowI18n,
  blue: crankshaftBlueI18n,
} = crankshaftI18n.cards;
