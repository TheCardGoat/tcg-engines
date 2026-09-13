import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { flashBolt } from "./flash-bolt.ts";

export const flashBoltI18n = defineFamilyI18n(flashBolt, {
  en: {
    name: "Flash Bolt",
    typeText: "Lightning Wizard Instant",
    text: ({ amount }) => `Deal ${amount} arcane damage to target hero.`,
  },
});

export const {
  red: flashBoltRedI18n,
  yellow: flashBoltYellowI18n,
  blue: flashBoltBlueI18n,
} = flashBoltI18n.cards;
