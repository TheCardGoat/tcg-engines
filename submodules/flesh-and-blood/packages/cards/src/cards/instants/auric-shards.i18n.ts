import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { auricShards } from "./auric-shards.ts";

export const auricShardsI18n = defineFamilyI18n(auricShards, {
  en: {
    name: "Auric Shards",
    typeText: "Lightning Illusionist Instant - Aura",
    text: (holoAmount) =>
      `When this enters the arena, up to 1 target attack with fragment gets +1{p}. If this has a holo counter, instead the attack gets +${holoAmount}{p}.\nWard 1`,
  },
});

export const {
  red: auricShardsRedI18n,
  yellow: auricShardsYellowI18n,
  blue: auricShardsBlueI18n,
} = auricShardsI18n.cards;
