import type { StructuredCardDefinition } from "@tcg/cyberpunk-types";

export const welcomeToNightCityRetailRoycePsychoOnTheEdge = {
  id: "9e681d3e-cbfd-4c7b-a69a-72a83dc8b847",
  externalId: "cb-royce-psycho-on-the-edge",
  slug: "royce-psycho-on-the-edge",
  name: "Royce — Psycho on the Edge",
  subname: null,
  displayName: "Royce — Psycho on the Edge",
  rulesText:
    "[GO SOLO] (Pay this Legend's cost to play it as a ready Unit. It can attack this turn. If it leaves the field, remove it from the game.)\nDuring your turn, this Legend has +2 power for each of its equipped Gear.",
  flavorText: null,
  description: null,
  youtubeUrl: null,
  sourceUrl: null,
  color: "red",
  classifications: ["Ganger", "Maelstrom"],
  set: {
    code: "welcometonightcityretail",
    name: "Welcome to Night City — Retail",
  },
  printNumber: "004",
  printings: [
    {
      id: "3e2e228b-dbfb-484b-b82d-6972ff184aab",
      collectorNumber: "004",
      imageUrl: "https://r2.tcg.online/public/cyberpunk/cards/welcometonightcityretail/004.webp",
      sourceImageUrl:
        "https://dstcynss47vun.cloudfront.net/prod/cyberpunk/portal/3e2e228b-dbfb-484b-b82d-6972ff184aab/render-mpvml5uz.webp",
      set: {
        code: "welcometonightcityretail",
        name: "Welcome to Night City — Retail",
      },
      rarity: "Rare",
      finish: "standard",
      artist: "Michal Ivan",
    },
    {
      id: "0e4966a2-e5cf-4acd-905a-750e9c4cefff",
      collectorNumber: "β004",
      imageUrl: "https://r2.tcg.online/public/cyberpunk/cards/welcometonightcitybeta/b004.webp",
      sourceImageUrl:
        "https://dstcynss47vun.cloudfront.net/prod/cyberpunk/portal/0e4966a2-e5cf-4acd-905a-750e9c4cefff/render-mpu5w6cz.webp",
      set: {
        code: "welcometonightcitybeta",
        name: "Welcome to Night City — Beta",
      },
      rarity: "Rare",
      finish: "standard",
      artist: "Michal Ivan",
    },
  ],
  selectedPrintingId: "3e2e228b-dbfb-484b-b82d-6972ff184aab",
  artist: "Michal Ivan",
  imageUrl: "https://r2.tcg.online/public/cyberpunk/cards/welcometonightcityretail/004.webp",
  sourceImageUrl:
    "https://dstcynss47vun.cloudfront.net/prod/cyberpunk/portal/3e2e228b-dbfb-484b-b82d-6972ff184aab/render-mpvml5uz.webp",
  rarity: "Rare",
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
      text: "GO SOLO (Pay this Legend's cost to play it as a ready Unit. It can attack this turn. If it leaves the field, remove it from the game.)",
      keyword: "goSolo",
      source: {
        selector: "self",
      },
      effects: [],
    },
    {
      kind: "static",
      text: "During your turn, this Legend has +2 power for each of its equipped Gear.",
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
} satisfies StructuredCardDefinition;
