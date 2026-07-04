import type { GearCardDefinition } from "@tcg/cyberpunk-types";
import { defineCyberpunkCard } from "../../define.ts";
import { gearAttachmentToUnitOrLegend } from "../../define.ts";

export const spoilerGorillaArms = defineCyberpunkCard({
  id: "500ae9b9-0afa-4b82-87ed-61c72583139c",
  slug: "gorilla-arms",
  rulesText:
    "(Equip to a Unit or face-up Legend.) The first time this Unit steals a Gig each turn, you may steal a rival Gig with the same number of sides.",
  name: "Gorilla Arms",
  displayName: "Gorilla Arms",
  canonicalId: "gorilla-arms",
  color: "yellow",
  classifications: ["Cyberware"],
  set: {
    code: "spoiler",
    name: "Spoiler Set",
  },
  printNumber: "111",
  artist: "TOPDOG",
  imageUrl: "https://cdn.tcg.online/public/cyberpunk/cards/spoiler/111.webp",
  rarity: null,
  legality: "legal",
  hasSellTag: true,
  ram: 4,
  type: "gear",
  cost: 4,
  power: 4,
  abilities: [
    {
      kind: "triggered",
      text: "The first time this Unit steals a Gig each turn, you may steal a rival Gig with the same number of sides.",
      trigger: {
        trigger: "event",
        event: {
          event: "gigStolen",
          player: "friendly",
          target: {
            selector: "gig",
            controller: "rival",
          },
          minAmount: 1,
          source: {
            selector: "host",
          },
        },
      },
      source: {
        selector: "host",
      },
      limits: ["firstTimeEachTurn"],
      effects: [
        {
          effect: "stealGig",
          target: {
            selector: "gig",
            controller: "rival",
            sameSidesAs: {
              selector: "context",
              key: "triggeredGigs",
            },
          },
          optional: true,
        },
      ],
    },
  ],
  attachment: gearAttachmentToUnitOrLegend(),
}) satisfies GearCardDefinition;
