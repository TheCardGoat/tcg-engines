import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { pointOfEscalation } from "./point-of-escalation.ts";

export const pointOfEscalationI18n = defineFamilyI18n(pointOfEscalation, {
  en: {
    name: "Point of Escalation",
    typeText: "Warrior Attack Reaction",
    text: "Target sword attack gets +2{p} for each time you've attacked with the sword this turn.",
  },
});

export const { yellow: pointOfEscalationYellowI18n } = pointOfEscalationI18n.cards;
