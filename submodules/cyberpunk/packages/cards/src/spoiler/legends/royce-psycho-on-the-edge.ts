import type { SpoilerCardDefinition } from "@tcg/cyberpunk-types";

export const spoilerRoycePsychoOnTheEdge = {
  id: "9e70c24e-f523-4cba-b70e-161793cd1a27",
  externalId: "cyberpunk:royce-psycho-on-the-edge",
  slug: "royce-psycho-on-the-edge",
  name: "Royce",
  subname: "Psycho on the Edge",
  displayName: "Royce - Psycho on the Edge",
  rulesText: "GO SOLO During your turn, this Legend has +2 power for each equipped Gear.",
  flavorText: null,
  color: "red",
  classifications: ["Ganger", "Maelstrom"],
  set: {
    code: "spoiler",
    name: "Spoiler Set",
  },
  printNumber: "131",
  printings: [
    {
      id: "def02aa2-5dcb-4bc1-a187-df6207373e6f",
      collectorNumber: "131",
      imageUrl: "https://r2.tcg.online/public/cyberpunk/cards/spoiler/b131.webp",
      sourceImageUrl: "https://dstcynss47vun.cloudfront.net/prod/cyberpunk/b131.webp",
      set: {
        code: "spoiler",
        name: "Spoiler Set",
      },
      rarity: null,
      finish: "foil",
      artist: "Pandart Studio",
    },
  ],
  selectedPrintingId: "def02aa2-5dcb-4bc1-a187-df6207373e6f",
  artist: "Pandart Studio",
  imageUrl: "https://r2.tcg.online/public/cyberpunk/cards/spoiler/b131.webp",
  sourceImageUrl: "https://dstcynss47vun.cloudfront.net/prod/cyberpunk/b131.webp",
  rarity: null,
  legality: "legal",
  hasSellTag: true,
  ram: 2,
  timingTriggers: [],
  keywords: ["goSolo"],
  type: "legend",
  cost: 6,
  power: 6,
  abilities: [
    {
      kind: "keyword",
      text: "GO SOLO",
      keyword: "goSolo",
      source: {
        selector: "self",
      },
      effects: [],
    },
    {
      kind: "static",
      text: "During your turn, this Legend has +2 power for each equipped Gear.",
      source: {
        selector: "self",
      },
      effects: [
        {
          effect: "modifyPower",
          target: {
            selector: "self",
          },
          value: {
            type: "perCount",
            multiplier: 2,
            target: {
              selector: "card",
              controller: "friendly",
              cardTypes: ["gear"],
              attachedTo: {
                selector: "self",
              },
            },
          },
          duration: "continuous",
          conditions: [
            {
              condition: "turn",
              player: "friendly",
            },
          ],
        },
      ],
    },
  ],
  reminderText: [],
} satisfies SpoilerCardDefinition;
