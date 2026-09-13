import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { spellbaneTrap } from "./spellbane-trap.ts";

export const spellbaneTrapI18n = defineFamilyI18n(spellbaneTrap, {
  en: {
    name: "Spellbane Trap",
    text: ({ textValue1 }) => `Your next arrow attack this turn gets +${textValue1}{p}.
Go again
When this defends and the attacking hero has dealt arcane damage this turn, create a Spellbane Aegis token.`,
    typeText: "Ranger Action - Trap",
  },
});

export const {
  red: spellbaneTrapRedI18n,
  yellow: spellbaneTrapYellowI18n,
  blue: spellbaneTrapBlueI18n,
} = spellbaneTrapI18n.cards;
