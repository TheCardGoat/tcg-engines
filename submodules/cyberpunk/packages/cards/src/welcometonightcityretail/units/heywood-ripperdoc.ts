import type { UnitCardDefinition } from "@tcg/cyberpunk-types";
import { defineCyberpunkCard } from "../../define.ts";

export const welcomeToNightCityRetailHeywoodRipperdoc = defineCyberpunkCard({
  id: "2a9deb43-bf9a-41db-9a05-bb0d357bb08e",
  canonicalId: "heywood-ripperdoc",
  slug: "heywood-ripperdoc",
  name: "Heywood Ripperdoc",
  displayName: "Heywood Ripperdoc",
  rulesText:
    "{Play} You may defeat a Gear. If its cost equals the value of a friendly Gig, draw 1.",
  color: "yellow",
  classifications: ["Ripperdoc"],
  set: {
    code: "welcometonightcityretail",
    name: "Welcome to Night City — Retail",
  },
  printNumber: "047",
  artist: "Łukasz Poller",
  imageUrl: "https://cdn.tcg.online/public/cyberpunk/cards/welcometonightcityretail/047.webp",
  rarity: "Uncommon",
  legality: "legal",
  hasSellTag: false,
  ram: 1,
  timingTriggers: ["play"],
  abilities: [
    {
      kind: "triggered",
      text: "Play You may defeat a Gear. If its cost equals the value of a friendly Gig, draw 1.",
      trigger: {
        trigger: "play",
      },
      source: {
        selector: "self",
      },
      bindings: [
        {
          id: "selectedGear",
          target: {
            selector: "card",
            zones: ["field", "legendArea"],
            cardTypes: ["gear"],
            selection: {
              mode: "choose",
              min: 0,
              max: 1,
            },
          },
        },
      ],
      effects: [
        {
          effect: "defeat",
          target: {
            selector: "bound",
            id: "selectedGear",
          },
          optional: true,
        },
        {
          effect: "draw",
          player: "friendly",
          amount: 1,
          conditions: [
            {
              condition: "costMatchesGig",
              target: {
                selector: "bound",
                id: "selectedGear",
              },
              controller: "friendly",
            },
          ],
        },
      ],
    },
  ],
  type: "unit",
  cost: 6,
  power: 8,
}) satisfies UnitCardDefinition;
