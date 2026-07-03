import type { LegendCardDefinition } from "@tcg/cyberpunk-types";
import { defineCyberpunkCard } from "../../define.ts";
import { goSoloAbility } from "@tcg/cyberpunk-types";

export const spoilerRoycePsychoOnTheEdge = defineCyberpunkCard({
  id: "9e70c24e-f523-4cba-b70e-161793cd1a27",
  slug: "royce-psycho-on-the-edge",
  rulesText: "GO SOLO During your turn, this Legend has +2 power for each equipped Gear.",
  subname: "Psycho on the Edge",
  name: "Royce",
  displayName: "Royce - Psycho on the Edge",
  canonicalId: "royce-psycho-on-the-edge",
  color: "red",
  classifications: ["Ganger", "Maelstrom"],
  set: {
    code: "spoiler",
    name: "Spoiler Set",
  },
  printNumber: "131",
  artist: "Pandart Studio",
  imageUrl: "https://cdn.tcg.online/public/cyberpunk/cards/spoiler/131.webp",
  rarity: null,
  legality: "legal",
  hasSellTag: true,
  ram: 2,
  keywords: ["goSolo"],
  type: "legend",
  cost: 6,
  power: 6,
  abilities: [
    goSoloAbility(),
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
}) satisfies LegendCardDefinition;
