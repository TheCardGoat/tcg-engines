import type { UnitCardDefinition } from "@tcg/cyberpunk-types";
import { defineCyberpunkCard } from "../../define.ts";

export const welcomeToNightCityRetailHanakoArasakaInAGildedCage = defineCyberpunkCard({
  id: "2902da45-ec28-4971-a731-ea1eda4c6ba1",
  slug: "hanako-arasaka-in-a-gilded-cage",
  rulesText:
    "{Play} Search the top 4 cards of your deck. Reveal any number of cards with cost equal to any friendly Gig values and add them to your hand. Bottom-deck the rest.",
  name: "Hanako Arasaka — In a Gilded Cage",
  displayName: "Hanako Arasaka — In a Gilded Cage",
  canonicalId: "hanako-arasaka-in-a-gilded-cage",
  color: "yellow",
  classifications: ["Arasaka", "Corpo", "Netrunner"],
  set: {
    code: "welcometonightcityretail",
    name: "Welcome to Night City — Retail",
  },
  printNumber: "046",
  artist: "Daniel Valaisis",
  imageUrl: "https://cdn.tcg.online/public/cyberpunk/cards/welcometonightcityretail/046.webp",
  rarity: "Rare",
  legality: "legal",
  hasSellTag: false,
  ram: 2,
  timingTriggers: ["play"],
  type: "unit",
  cost: 4,
  power: 1,
  abilities: [
    {
      kind: "triggered",
      text: "PLAY Search the top 4 cards of your deck. Reveal any number of cards with cost equal to any friendly Gig values and add them to your hand. Bottom-deck the rest.",
      trigger: {
        trigger: "play",
      },
      source: {
        selector: "self",
      },
      effects: [
        {
          effect: "scry",
          player: "friendly",
          amount: 4,
          destinations: [
            {
              zone: "hand",
              reveal: true,
              target: {
                selector: "card",
                controller: "friendly",
                zones: ["deck"],
                costEqualsGigValueOf: {
                  selector: "gig",
                  controller: "friendly",
                  amount: "all",
                },
              },
            },
            {
              zone: "deckBottom",
              remainder: true,
              order: "original",
            },
          ],
        },
      ],
    },
  ],
}) satisfies UnitCardDefinition;
