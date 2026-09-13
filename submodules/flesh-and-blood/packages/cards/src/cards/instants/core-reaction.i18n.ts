import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { coreReaction } from "./core-reaction.ts";

export const coreReactionI18n = defineFamilyI18n(coreReaction, {
  en: {
    name: "Core Reaction",
    typeText: "Lightning Wizard Instant - Aura",
    text: ({ amount }) =>
      `At the beginning of your action phase, destroy this and deal ${amount} arcane damage to any target.`,
  },
});

export const {
  red: coreReactionRedI18n,
  yellow: coreReactionYellowI18n,
  blue: coreReactionBlueI18n,
} = coreReactionI18n.cards;
