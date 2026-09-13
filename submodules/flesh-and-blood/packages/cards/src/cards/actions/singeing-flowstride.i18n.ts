import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { singeingFlowstride } from "./singeing-flowstride.ts";

export const singeingFlowstrideI18n = defineFamilyI18n(singeingFlowstride, {
  en: {
    name: "Singeing Flowstride",
    text: 'Quickstrike - If this has go again, it gets "When this attacks a hero, deal 1 arcane damage to them."\nThe first time this deals damage to a hero, create a Lightning Flow token.',
    typeText: "Lightning Runeblade Action - Attack",
  },
});

export const {
  red: singeingFlowstrideRedI18n,
  yellow: singeingFlowstrideYellowI18n,
  blue: singeingFlowstrideBlueI18n,
} = singeingFlowstrideI18n.cards;
