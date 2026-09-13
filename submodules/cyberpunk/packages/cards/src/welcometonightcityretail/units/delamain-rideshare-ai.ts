import type { UnitCardDefinition } from "@tcg/cyberpunk-types";
import { defineCyberpunkCard } from "../../define.ts";

export const welcomeToNightCityRetailDelamainRideshareAi = defineCyberpunkCard({
  id: "3bb1f191-927e-45b3-86ca-cb30baabfe0d",
  canonicalId: "delamain-rideshare-ai",
  slug: "delamain-rideshare-ai",
  subname: "Rideshare AI",
  name: "Delamain",
  displayName: "Delamain: Rideshare AI",
  rulesText: "{Play} Draw 2.\n(Units with power 0 don't steal Gigs.)",
  color: "blue",
  classifications: ["AI"],
  set: {
    code: "welcometonightcityretail",
    name: "Welcome to Night City — Retail",
  },
  printNumber: "111",
  artist: "Łukasz Wiktorzak",
  imageUrl: "https://cdn.tcg.online/public/cyberpunk/cards/welcometonightcityretail/111.webp",
  rarity: "Uncommon",
  legality: "legal",
  hasSellTag: false,
  ram: 3,
  timingTriggers: ["play"],
  abilities: [
    {
      kind: "triggered",
      text: "Play Draw 2.",
      trigger: {
        trigger: "play",
      },
      source: {
        selector: "self",
      },
      effects: [
        {
          effect: "draw",
          player: "friendly",
          amount: 2,
        },
      ],
    },
  ],
  reminderText: ["Units with power 0 don't steal Gigs."],
  type: "unit",
  cost: 3,
  power: 0,
}) satisfies UnitCardDefinition;
