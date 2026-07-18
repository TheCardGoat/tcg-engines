import type { UnitCardDefinition } from "@tcg/cyberpunk-types";
import { defineCyberpunkCard } from "../../define.ts";

export const welcomeToNightCityRetailPepeNajarroWorkingDoubles = defineCyberpunkCard({
  id: "0974a7af-dcd7-44d9-b57a-b6a4719afcd6",
  canonicalId: "pepe-najarro-working-doubles",
  slug: "pepe-najarro-working-doubles",
  name: "Pepe Najarro — Working Doubles",
  displayName: "Pepe Najarro — Working Doubles",
  rulesText:
    "{Attack} If you control a value-pair of Gigs, ready up to 2 MERC Legends in your Legends area.",
  color: "green",
  classifications: ["Valentino"],
  set: { code: "welcometonightcityretail", name: "Welcome to Night City — Retail" },
  printNumber: "086",
  artist: "TOPDOG Entertainment",
  imageUrl: "https://cdn.tcg.online/public/cyberpunk/cards/welcometonightcityretail/086.webp",
  rarity: "Uncommon",
  legality: "legal",
  hasSellTag: false,
  ram: 2,
  type: "unit",
  cost: 4,
  power: 6,
  abilities: [
    {
      kind: "triggered",
      text: "ATTACK If you control a value-pair of Gigs, ready up to 2 MERC Legends in your Legends area.",
      trigger: { trigger: "attack" },
      source: { selector: "self" },
      effects: [
        {
          effect: "ready",
          target: {
            selector: "card",
            controller: "friendly",
            zones: ["legendArea"],
            cardTypes: ["legend"],
            classifications: ["Merc"],
            state: "spent",
            selection: { mode: "choose", min: 0, max: 2 },
          },
          conditions: [{ condition: "hasGigPair", controller: "friendly" }],
        },
      ],
    },
  ],
}) satisfies UnitCardDefinition;
