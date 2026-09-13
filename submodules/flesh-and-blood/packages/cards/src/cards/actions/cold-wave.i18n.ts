import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { coldWave } from "./cold-wave.ts";

export const coldWaveI18n = defineFamilyI18n(coldWave, {
  en: {
    name: "Cold Wave",
    text: "Ice Fusion\nIf Cold Wave was fused, cards and activated abilities cost opposing heroes an additional {r} this turn.",
    typeText: "Elemental Ranger Action - Arrow Attack",
  },
});

export const {
  red: coldWaveRedI18n,
  yellow: coldWaveYellowI18n,
  blue: coldWaveBlueI18n,
} = coldWaveI18n.cards;
