import type { UnitCardDefinition } from "@tcg/cyberpunk-types";
import { defineCyberpunkCard } from "../../define.ts";

export const welcomeToNightCityRetailMaelstromGoons = defineCyberpunkCard({
  id: "f57094f7-0720-4ba5-9a71-aafbc714d65a",
  canonicalId: "maelstrom-goons",
  slug: "maelstrom-goons",
  name: "Maelstrom Goons",
  displayName: "Maelstrom Goons",
  rulesText: "When this Unit steals a Gig, if it's equipped, a Rival discards 1.",
  color: "yellow",
  classifications: ["Ganger", "Maelstrom"],
  set: {
    code: "welcometonightcityretail",
    name: "Welcome to Night City — Retail",
  },
  printNumber: "049",
  artist: "Alexander Dudar",
  imageUrl: "https://cdn.tcg.online/public/cyberpunk/cards/welcometonightcityretail/049.webp",
  rarity: "Common",
  legality: "legal",
  hasSellTag: false,
  ram: 2,
  abilities: [
    {
      kind: "triggered",
      text: "When this Unit steals a Gig, if it's equipped, a Rival discards 1.",
      trigger: {
        trigger: "event",
        event: {
          event: "gigStolen",
          player: "friendly",
          target: {
            selector: "gig",
            controller: "rival",
            amount: 1,
          },
          minAmount: 1,
          source: {
            selector: "self",
          },
        },
      },
      source: {
        selector: "self",
      },
      effects: [
        {
          effect: "discardFromHand",
          player: "rival",
          amount: 1,
          conditions: [
            {
              condition: "targetExists",
              target: {
                selector: "card",
                controller: "friendly",
                cardTypes: ["gear"],
                attachedTo: {
                  selector: "self",
                },
              },
            },
          ],
        },
      ],
    },
  ],
  type: "unit",
  cost: 3,
  power: 3,
}) satisfies UnitCardDefinition;
