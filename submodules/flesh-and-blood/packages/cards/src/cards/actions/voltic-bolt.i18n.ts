import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { volticBolt } from "./voltic-bolt.ts";

export const volticBoltI18n = defineFamilyI18n(volticBolt, {
  en: {
    name: "Voltic Bolt",
    text: ({ damage }) => `Deal ${damage} arcane damage to target hero.`,
    typeText: "Wizard Action",
  },
});

export const {
  red: volticBoltRedI18n,
  yellow: volticBoltYellowI18n,
  blue: volticBoltBlueI18n,
} = volticBoltI18n.cards;
