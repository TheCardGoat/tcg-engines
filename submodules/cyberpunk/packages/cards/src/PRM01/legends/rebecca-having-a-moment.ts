import type { LegendCardDefinition } from "@tcg/cyberpunk-types";
import { defineCyberpunkCard } from "../../define.ts";

export const prm01RebeccaHavingAMoment = defineCyberpunkCard({
  id: "4acee220-f0ae-4bdc-85c9-f8e70ba99673",
  canonicalId: "rebecca-having-a-moment",
  slug: "rebecca-having-a-moment",
  name: "Rebecca — Having a Moment",
  displayName: "Rebecca — Having a Moment",
  color: "red",
  set: {
    code: "PRM01",
    name: "Set 1 Promos",
  },
  printNumber: "005",
  artist: "Narupiti Harunsong",
  imageUrl: "https://cdn.tcg.online/public/cyberpunk/cards/PRM01/005.webp",
  rarity: "Nova Rare",
  legality: "legal",
  hasSellTag: false,
  ram: null,
  type: "legend",
  cost: null,
  power: null,
}) satisfies LegendCardDefinition;
