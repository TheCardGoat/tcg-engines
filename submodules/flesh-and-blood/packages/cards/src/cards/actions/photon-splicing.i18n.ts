import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { photonSplicing } from "./photon-splicing.ts";

export const photonSplicingI18n = defineFamilyI18n(photonSplicing, {
  en: {
    name: "Photon Splicing",
    text: ({ damage }) =>
      `Deal ${damage} arcane damage to any target.\nInstant - Discard this: Amp 1`,
    typeText: "Wizard Action",
  },
});

export const {
  red: photonSplicingRedI18n,
  yellow: photonSplicingYellowI18n,
  blue: photonSplicingBlueI18n,
} = photonSplicingI18n.cards;
