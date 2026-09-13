import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { arcanicSpike } from "./arcanic-spike.ts";

export const arcanicSpikeI18n = defineFamilyI18n(arcanicSpike, {
  en: {
    name: "Arcanic Spike",
    text: "If you've dealt arcane damage this turn, this gets +2{p}.",
    typeText: "Runeblade Action - Attack",
  },
});

export const {
  red: arcanicSpikeRedI18n,
  yellow: arcanicSpikeYellowI18n,
  blue: arcanicSpikeBlueI18n,
} = arcanicSpikeI18n.cards;
