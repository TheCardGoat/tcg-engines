import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { forebodingBolt } from "./foreboding-bolt.ts";

export const forebodingBoltI18n = defineFamilyI18n(forebodingBolt, {
  en: {
    name: "Foreboding Bolt",
    text: ({ damage }) => `Deal ${damage} damage to target hero.\nOpt 1`,
    typeText: "Wizard Action",
  },
});

export const {
  red: forebodingBoltRedI18n,
  yellow: forebodingBoltYellowI18n,
  blue: forebodingBoltBlueI18n,
} = forebodingBoltI18n.cards;
