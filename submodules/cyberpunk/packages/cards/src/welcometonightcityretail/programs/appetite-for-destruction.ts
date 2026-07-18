import type { ProgramCardDefinition } from "@tcg/cyberpunk-types";
import { defineCyberpunkCard } from "../../define.ts";

export const welcomeToNightCityRetailAppetiteForDestruction = defineCyberpunkCard({
  id: "59ddecca-1501-492a-b8b1-d4b38d4486c9",
  canonicalId: "appetite-for-destruction",
  slug: "appetite-for-destruction",
  name: "Appetite for Destruction",
  displayName: "Appetite for Destruction",
  rulesText:
    "The next time a friendly Unit wins a fight by 3+ power this turn, it also steals a Gig.",
  color: "red",
  classifications: ["Ganger"],
  set: { code: "welcometonightcityretail", name: "Welcome to Night City — Retail" },
  printNumber: "028",
  artist: "Miguel Valderrama & Jason Wordie",
  imageUrl: "https://cdn.tcg.online/public/cyberpunk/cards/welcometonightcityretail/028.webp",
  rarity: "Uncommon",
  legality: "legal",
  hasSellTag: true,
  ram: 4,
  type: "program",
  cost: 3,
  abilities: [
    {
      kind: "triggered",
      text: "The next time a friendly Unit wins a fight by 3+ power this turn, it also steals a Gig.",
      trigger: { trigger: "play" },
      source: { selector: "self" },
      effects: [
        {
          effect: "grantNextFightWinGigSteal",
          minPowerMargin: 3,
          duration: "turn",
        },
      ],
    },
  ],
}) satisfies ProgramCardDefinition;
