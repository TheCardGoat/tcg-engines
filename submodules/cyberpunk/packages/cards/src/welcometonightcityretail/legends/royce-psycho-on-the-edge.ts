import type { StructuredCardDefinition } from "@tcg/cyberpunk-types";

export const welcomeToNightCityRetailRoycePsychoOnTheEdge = {
  id: "9e681d3e-cbfd-4c7b-a69a-72a83dc8b847",
  externalId: "cb-royce-psycho-on-the-edge",
  slug: "royce-psycho-on-the-edge",
  name: "Royce — Psycho on the Edge",
  displayName: "Royce — Psycho on the Edge",
  rulesText:
    "[GO SOLO] (Pay this Legend's cost to play it as a ready Unit. It can attack this turn. If it leaves the field, remove it from the game.)\nDuring your turn, this Legend has +2 power for each of its equipped Gear.",
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
      setCode: "welcometonightcityretail",
      rarity: "Rare",
    },
    {
      id: "0e4966a2-e5cf-4acd-905a-750e9c4cefff",
      collectorNumber: "β004",
      setCode: "welcometonightcitybeta",
      rarity: "Rare",
    },
  ],
  selectedPrintingId: "3e2e228b-dbfb-484b-b82d-6972ff184aab",
  artist: "Michal Ivan",
  imageUrl: "https://cdn.tcg.online/public/cyberpunk/cards/welcometonightcityretail/004.webp",
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
