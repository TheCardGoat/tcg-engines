import type { LegendCardDefinition } from "@tcg/cyberpunk-types";
import { defineCyberpunkCard } from "../../define.ts";
import { goSoloAbility } from "@tcg/cyberpunk-types";

export const welcomeToNightCityRetailRoycePsychoOnTheEdge = defineCyberpunkCard({
  id: "9e681d3e-cbfd-4c7b-a69a-72a83dc8b847",
  slug: "royce-psycho-on-the-edge",
  rulesText:
    "{Go Solo} (Pay this Legend's cost to play it as a ready Unit. It can attack this turn. If it leaves the field, remove it from the game.)\nDuring your turn, this Legend has +2 power for each of its equipped Gear.",
  name: "Royce — Psycho on the Edge",
  displayName: "Royce — Psycho on the Edge",
  canonicalId: "royce-psycho-on-the-edge",
  color: "red",
  classifications: ["Ganger", "Maelstrom"],
  set: {
    code: "welcometonightcityretail",
    name: "Welcome to Night City — Retail",
  },
  printNumber: "004",
  artist: "Michal Ivan",
  imageUrl: "https://cdn.tcg.online/public/cyberpunk/cards/welcometonightcityretail/004.webp",
  rarity: "Rare",
  legality: "legal",
  hasSellTag: true,
  ram: 2,
  keywords: ["goSolo"],
  type: "legend",
  cost: 6,
  power: 6,
  abilities: [
    goSoloAbility({
      text: "GO SOLO (Pay this Legend's cost to play it as a ready Unit. It can attack this turn. If it leaves the field, remove it from the game.)",
    }),
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
}) satisfies LegendCardDefinition;
