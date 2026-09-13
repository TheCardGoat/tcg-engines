import type { UnitCardDefinition } from "@tcg/cyberpunk-types";
import { defineCyberpunkCard } from "../../define.ts";

export const welcomeToNightCityRetailMaxtacAv = defineCyberpunkCard({
  id: "d6f16c44-6d56-48ff-8130-154eea5540ca",
  canonicalId: "maxtac-av",
  slug: "maxtac-av",
  name: "MaxTac AV",
  displayName: "MaxTac AV",
  rulesText: "{Play} You may swap a friendly Gig with a rival Gig.",
  color: "green",
  classifications: ["NCPD", "Vehicle"],
  set: {
    code: "welcometonightcityretail",
    name: "Welcome to Night City — Retail",
  },
  printNumber: "080",
  artist: "Olgierd Ciszak",
  imageUrl: "https://cdn.tcg.online/public/cyberpunk/cards/welcometonightcityretail/080.webp",
  rarity: "Common",
  legality: "legal",
  hasSellTag: false,
  ram: 2,
  timingTriggers: ["play"],
  abilities: [
    {
      kind: "triggered",
      text: "Play You may swap a friendly Gig with a rival Gig.",
      trigger: {
        trigger: "play",
      },
      source: {
        selector: "self",
      },
      bindings: [
        {
          id: "friendlyGig",
          target: {
            selector: "gig",
            controller: "friendly",
            amount: 1,
            selection: {
              mode: "choose",
              min: 1,
              max: 1,
            },
          },
        },
        {
          id: "rivalGig",
          target: {
            selector: "gig",
            controller: "rival",
            amount: 1,
            selection: {
              mode: "choose",
              min: 1,
              max: 1,
            },
          },
        },
      ],
      effects: [
        {
          effect: "swapGigs",
          friendly: {
            selector: "bound",
            id: "friendlyGig",
          },
          rival: {
            selector: "bound",
            id: "rivalGig",
          },
          optional: true,
        },
      ],
    },
  ],
  type: "unit",
  cost: 5,
  power: 8,
}) satisfies UnitCardDefinition;
