import type { UnitCardDefinition } from "@tcg/cyberpunk-types";
import { defineCyberpunkCard } from "../../define.ts";

export const spoilerHanakoArasakaInAGildedCage = defineCyberpunkCard({
  id: "315450ca-6472-4bdc-a018-bb0a8f3e0467",
  slug: "hanako-arasaka-in-a-gilded-cage",
  rulesText:
    "PLAY Reveal the top 4 cards of your deck. Then choose a friendly Gig. Add all cards with cost equal to that Gig's value to your hand. Trash the rest.",
  subname: "In A Gilded Cage",
  name: "Hanako Arasaka",
  displayName: "Hanako Arasaka - In A Gilded Cage",
  canonicalId: "hanako-arasaka-in-a-gilded-cage",
  color: "yellow",
  classifications: ["Arasaka", "Corpo", "Netrunner"],
  set: {
    code: "spoiler",
    name: "Spoiler Set",
  },
  printNumber: "126",
  artist: "Akram",
  imageUrl: "https://cdn.tcg.online/public/cyberpunk/cards/spoiler/126.webp",
  rarity: null,
  legality: "legal",
  hasSellTag: false,
  ram: 2,
  timingTriggers: ["play"],
  type: "unit",
  cost: 3,
  power: 0,
  abilities: [
    {
      kind: "triggered",
      text: "PLAY Reveal the top 4 cards of your deck. Then choose a friendly Gig. Add all cards with cost equal to that Gig's value to your hand. Trash the rest.",
      trigger: {
        trigger: "play",
      },
      source: {
        selector: "self",
      },
      bindings: [
        {
          id: "selectedGig",
          target: {
            selector: "gig",
            controller: "friendly",
          },
        },
      ],
      effects: [
        {
          effect: "searchDeck",
          player: "friendly",
          lookCount: 4,
          target: {
            selector: "card",
            controller: "friendly",
            zones: ["deck"],
            costEqualsGigValueOf: {
              selector: "bound",
              id: "selectedGig",
            },
          },
          select: {
            kind: "all",
          },
          reveal: true,
          destination: "hand",
          remainder: {
            zone: "trash",
          },
        },
      ],
    },
  ],
}) satisfies UnitCardDefinition;
