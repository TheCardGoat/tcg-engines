import type { SpoilerCardDefinition } from "@tcg/cyberpunk-types";
import { gearAttachmentToUnitOrLegend } from "../../define.ts";

export const spoilerGorillaArms = {
  id: "500ae9b9-0afa-4b82-87ed-61c72583139c",
  externalId: "cyberpunk:gorilla-arms",
  slug: "gorilla-arms",
  name: "Gorilla Arms",
  subname: null,
  displayName: "Gorilla Arms",
  rulesText:
    "(Equip to a Unit or face-up Legend.) The first time this Unit steals a Gig each turn, you may steal a rival Gig with the same number of sides.",
  flavorText: null,
  color: "yellow",
  classifications: ["Cyberware"],
  set: {
    code: "spoiler",
    name: "Spoiler Set",
  },
  printNumber: "111",
  printings: [
    {
      id: "925ab8cc-1f72-4e44-8acd-fe2259666da6",
      collectorNumber: "111",
      imageUrl: "https://r2.tcg.online/public/cyberpunk/cards/spoiler/b111.webp",
      sourceImageUrl: "https://dstcynss47vun.cloudfront.net/prod/cyberpunk/b111.webp",
      set: {
        code: "spoiler",
        name: "Spoiler Set",
      },
      rarity: null,
      finish: "standard",
      artist: "TOPDOG",
    },
  ],
  selectedPrintingId: "925ab8cc-1f72-4e44-8acd-fe2259666da6",
  artist: "TOPDOG",
  imageUrl: "https://r2.tcg.online/public/cyberpunk/cards/spoiler/b111.webp",
  sourceImageUrl: "https://dstcynss47vun.cloudfront.net/prod/cyberpunk/b111.webp",
  rarity: null,
  legality: "legal",
  hasSellTag: true,
  ram: 4,
  timingTriggers: [],
  keywords: [],
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
  reminderText: [],
  attachment: gearAttachmentToUnitOrLegend(),
} satisfies SpoilerCardDefinition;
