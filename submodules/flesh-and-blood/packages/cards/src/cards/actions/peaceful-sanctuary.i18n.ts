import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { peacefulSanctuary } from "./peaceful-sanctuary.ts";

export const peacefulSanctuaryI18n = defineFamilyI18n(peacefulSanctuary, {
  en: {
    name: "Peaceful Sanctuary",
    typeText: "Generic Action - Aura",
    text: "Heroes can't create aura tokens.\nAt the start of your action phase, destroy this.",
  },
});

export const { red: peacefulSanctuaryRedI18n } = peacefulSanctuaryI18n.cards;
