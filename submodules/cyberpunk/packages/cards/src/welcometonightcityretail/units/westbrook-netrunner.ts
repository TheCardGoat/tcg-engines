import type { UnitCardDefinition } from "@tcg/cyberpunk-types";
import { defineCyberpunkCard } from "../../define.ts";
export const welcomeToNightCityRetailWestbrookNetrunner = defineCyberpunkCard({
  id: "b7a94000-c026-433e-82fa-901bf22db54e",
  canonicalId: "westbrook-netrunner",
  slug: "westbrook-netrunner",
  name: "Westbrook Netrunner",
  displayName: "Westbrook Netrunner",
  rulesText:
    "{Play} Until your next turn, rival Legends can't steal friendly Gigs with value less than their power.",
  color: "blue",
  classifications: ["Netrunner"],
  set: { code: "welcometonightcityretail", name: "Welcome to Night City — Retail" },
  printNumber: "127",
  artist: "ADIA",
  imageUrl: "https://cdn.tcg.online/public/cyberpunk/cards/welcometonightcityretail/127.webp",
  rarity: "Common",
  legality: "legal",
  hasSellTag: false,
  ram: 2,
  timingTriggers: ["play"],
  type: "unit",
  cost: 4,
  power: 5,
  abilities: [
    {
      kind: "triggered",
      text: "{Play} Until your next turn, rival Legends can't steal friendly Gigs with value less than their power.",
      trigger: { trigger: "play" },
      source: { selector: "self" },
      effects: [
        {
          effect: "grantRule",
          target: { selector: "self" },
          rule: "cantStealGigBelowPower",
          duration: "untilSourceNextTurn",
        },
      ],
    },
  ],
}) satisfies UnitCardDefinition;
