import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { electrostaticDischarge } from "./electrostatic-discharge.ts";

export const electrostaticDischargeI18n = defineFamilyI18n(electrostaticDischarge, {
  en: {
    name: "Electrostatic Discharge",
    typeText: "Lightning Instant",
    text: ({ amount }) =>
      `The next attack action card you play this turn with cost 1 or less gets +${amount}{p}.`,
  },
});

export const {
  red: electrostaticDischargeRedI18n,
  yellow: electrostaticDischargeYellowI18n,
  blue: electrostaticDischargeBlueI18n,
} = electrostaticDischargeI18n.cards;
