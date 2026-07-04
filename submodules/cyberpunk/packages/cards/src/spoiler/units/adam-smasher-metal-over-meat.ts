import type { UnitCardDefinition } from "@tcg/cyberpunk-types";
import { defineCyberpunkCard } from "../../define.ts";

export const spoilerAdamSmasherMetalOverMeat = defineCyberpunkCard({
  id: "ad8dee60-9812-4d00-95b6-a79a8dd632f3",
  slug: "adam-smasher-metal-over-meat",
  rulesText: "PLAY Defeat all other Units.",
  subname: "Metal Over Meat",
  name: "Adam Smasher",
  displayName: "Adam Smasher - Metal Over Meat",
  canonicalId: "adam-smasher-metal-over-meat",
  color: "yellow",
  classifications: ["Arasaka", "Merc"],
  set: {
    code: "spoiler",
    name: "Spoiler Set",
  },
  printNumber: "137",
  artist: "Łukasz Poller",
  imageUrl: "https://cdn.tcg.online/public/cyberpunk/cards/spoiler/137.webp",
  rarity: null,
  legality: "legal",
  hasSellTag: false,
  ram: 5,
  timingTriggers: ["play"],
  type: "unit",
  cost: 9,
  power: 15,
  abilities: [
    {
      kind: "triggered",
      text: "PLAY Defeat all other Units.",
      trigger: {
        trigger: "play",
      },
      source: {
        selector: "self",
      },
      effects: [
        {
          effect: "defeat",
          target: {
            selector: "card",
            zones: ["field"],
            cardTypes: ["unit"],
            excludeSelf: true,
          },
        },
      ],
    },
  ],
}) satisfies UnitCardDefinition;
