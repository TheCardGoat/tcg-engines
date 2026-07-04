import type { UnitCardDefinition } from "@tcg/cyberpunk-types";
import { defineCyberpunkCard } from "../../define.ts";

export const spoilerCaliberTotentanzSTopDog = defineCyberpunkCard({
  id: "37529705-a5aa-45ec-9051-28cc2da4b6b4",
  slug: "caliber-totentanz-s-top-dog",
  rulesText:
    "DEFEATED A rival discards 1. If the card's cost is equal to the value of a friendly Gig, that rival discards 1 more.",
  subname: "Totentanz's Top Dog",
  name: "Caliber",
  displayName: "Caliber - Totentanz's Top Dog",
  canonicalId: "caliber-totentanz-s-top-dog",
  color: "yellow",
  classifications: ["Ganger", "Maelstrom"],
  set: {
    code: "spoiler",
    name: "Spoiler Set",
  },
  printNumber: "036",
  artist: "André Lima Araújo with Chris O'Halloran",
  imageUrl: "https://cdn.tcg.online/public/cyberpunk/cards/spoiler/036.webp",
  rarity: null,
  legality: "legal",
  hasSellTag: false,
  ram: 4,
  type: "unit",
  cost: 5,
  power: 6,
  abilities: [
    {
      kind: "triggered",
      text: "DEFEATED A rival discards 1. If the card's cost is equal to the value of a friendly Gig, that rival discards 1 more.",
      trigger: {
        trigger: "defeated",
      },
      source: {
        selector: "self",
      },
      effects: [
        {
          effect: "discardFromHand",
          player: "rival",
          amount: 1,
        },
        {
          effect: "discardFromHand",
          player: "rival",
          amount: 1,
          conditions: [
            {
              condition: "costMatchesGig",
              target: {
                selector: "context",
                key: "discardedCards",
              },
              controller: "friendly",
            },
          ],
        },
      ],
    },
  ],
}) satisfies UnitCardDefinition;
