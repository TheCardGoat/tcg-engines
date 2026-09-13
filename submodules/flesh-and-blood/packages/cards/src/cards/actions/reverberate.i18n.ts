import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { reverberate } from "./reverberate.ts";

export const reverberateI18n = defineFamilyI18n(reverberate, {
  en: {
    name: "Reverberate",
    text: ({ damage }) =>
      `Deal ${damage} arcane damage to target opposing hero.\nIf Reverberate deals damage, you may banish a Wizard 'non-attack' action card from your hand with {r} cost less than or equal to the damage dealt by Reverberate. If you do, you may play it this turn as though it were an instant.`,
    typeText: "Wizard Action",
  },
});

export const {
  red: reverberateRedI18n,
  yellow: reverberateYellowI18n,
  blue: reverberateBlueI18n,
} = reverberateI18n.cards;
