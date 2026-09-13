import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { snapback } from "./snapback.ts";

export const snapbackI18n = defineFamilyI18n(snapback, {
  en: {
    name: "Snapback",
    text: ({ damage }) =>
      `Deal ${damage} arcane damage to target hero.\nIf you have played another Wizard 'non-attack' action card this turn, you may play Snapback as though it were an instant.`,
    typeText: "Wizard Action",
  },
});

export const {
  red: snapbackRedI18n,
  yellow: snapbackYellowI18n,
  blue: snapbackBlueI18n,
} = snapbackI18n.cards;
