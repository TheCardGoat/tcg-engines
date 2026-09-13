import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { blizzardBolt } from "./blizzard-bolt.ts";

export const blizzardBoltI18n = defineFamilyI18n(blizzardBolt, {
  en: {
    name: "Blizzard Bolt",
    text: "Ice Fusion\nIf Blizzard Bolt was fused, whenever an attack deals damage to a hero this turn, create a Frostbite token under their control.",
    typeText: "Elemental Ranger Action - Arrow Attack",
  },
});

export const {
  red: blizzardBoltRedI18n,
  yellow: blizzardBoltYellowI18n,
  blue: blizzardBoltBlueI18n,
} = blizzardBoltI18n.cards;
