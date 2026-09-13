import type { UnitCardDefinition } from "@tcg/cyberpunk-types";
import { defineCyberpunkCard } from "../../define.ts";

export const welcomeToNightCityRetailChromeFang = defineCyberpunkCard({
  id: "3c4cf61f-c469-4ad6-a209-67e715f9d45b",
  canonicalId: "chrome-fang",
  slug: "chrome-fang",
  name: "Chrome Fang",
  displayName: "Chrome Fang",
  rulesText:
    "{Play} Until your next turn, rival Units can't steal friendly Gigs with value higher than their power.",
  color: "red",
  classifications: ["Ganger", "Netrunner", "Tyger Claws"],
  set: {
    code: "welcometonightcityretail",
    name: "Welcome to Night City — Retail",
  },
  printNumber: "008",
  artist: "Bernard Kowalczuk",
  imageUrl: "https://cdn.tcg.online/public/cyberpunk/cards/welcometonightcityretail/008.webp",
  rarity: "Common",
  legality: "legal",
  hasSellTag: false,
  ram: 1,
  timingTriggers: ["play"],
  abilities: [
    {
      kind: "triggered",
      text: "Play Until your next turn, rival Units can't steal friendly Gigs with value higher than their power.",
      trigger: {
        trigger: "play",
      },
      source: {
        selector: "self",
      },
      effects: [
        {
          effect: "grantRule",
          target: {
            selector: "self",
          },
          rule: "cantStealGigAbovePower",
          duration: "untilSourceNextTurn",
        },
      ],
    },
  ],
  type: "unit",
  cost: 5,
  power: 6,
}) satisfies UnitCardDefinition;
