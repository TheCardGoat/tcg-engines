import type { UnitCardDefinition } from "@tcg/cyberpunk-types";
import { defineCyberpunkCard } from "../../define.ts";

export const welcomeToNightCityRetailModdedMuramasa = defineCyberpunkCard({
  id: "08b52bdb-be1e-4931-90c4-4354eea5b145",
  canonicalId: "modded-muramasa",
  slug: "modded-muramasa",
  name: "Modded Muramasa",
  displayName: "Modded Muramasa",
  rulesText:
    "At the end of your turn, if you have less ☆ (Street Cred) than a Rival, ready this Unit.",
  color: "blue",
  classifications: ["Vehicle"],
  set: {
    code: "welcometonightcityretail",
    name: "Welcome to Night City — Retail",
  },
  printNumber: "121",
  artist: "Mooncolony",
  imageUrl: "https://cdn.tcg.online/public/cyberpunk/cards/welcometonightcityretail/121.webp",
  rarity: "Common",
  legality: "legal",
  hasSellTag: false,
  ram: 2,
  abilities: [
    {
      kind: "triggered",
      text: "At the end of your turn, if you have less ☆ (Street Cred) than a Rival, ready this Unit.",
      trigger: {
        trigger: "event",
        event: {
          event: "turnEnded",
          player: "friendly",
        },
      },
      source: {
        selector: "self",
      },
      effects: [
        {
          effect: "ready",
          target: {
            selector: "self",
          },
          conditions: [
            {
              condition: "streetCredComparison",
              controller: "friendly",
              comparison: "lt",
              other: "rival",
            },
          ],
        },
      ],
    },
  ],
  type: "unit",
  cost: 5,
  power: 4,
}) satisfies UnitCardDefinition;
