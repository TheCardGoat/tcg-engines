import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { buzzBolt } from "./buzz-bolt.ts";

export const buzzBoltI18n = defineFamilyI18n(buzzBolt, {
  en: {
    name: "Buzz Bolt",
    text: ({ textValue1 }) => `Lightning Fusion
If Buzz Bolt was fused, whenever an attack hits a hero this turn, it deals ${textValue1} damage to them.`,
    typeText: "Elemental Ranger Action - Arrow Attack",
  },
});

export const {
  red: buzzBoltRedI18n,
  yellow: buzzBoltYellowI18n,
  blue: buzzBoltBlueI18n,
} = buzzBoltI18n.cards;
