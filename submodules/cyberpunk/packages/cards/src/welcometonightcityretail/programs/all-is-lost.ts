import type { ProgramCardDefinition } from "@tcg/cyberpunk-types";
import { defineCyberpunkCard } from "../../define.ts";

export const welcomeToNightCityRetailAllIsLost = defineCyberpunkCard({
  id: "1f969c27-dddb-4971-9ab5-bd728c3e3e52",
  slug: "all-is-lost",
  rulesText: "Trash 3. Add a Unit from among them to your hand.",
  name: "All is Lost",
  displayName: "All is Lost",
  canonicalId: "all-is-lost",
  color: "red",
  classifications: ["Zetatech"],
  set: {
    code: "welcometonightcityretail",
    name: "Welcome to Night City — Retail",
  },
  printNumber: "027",
  artist: "Fabrizio De Tommaso",
  imageUrl: "https://cdn.tcg.online/public/cyberpunk/cards/welcometonightcityretail/027.webp",
  rarity: "Common",
  legality: "legal",
  hasSellTag: true,
  ram: 2,
  timingTriggers: ["play"],
  type: "program",
  cost: 1,
  power: null,
  abilities: [
    {
      kind: "triggered",
      text: "Trash 3. Add a Unit from among them to your hand.",
      trigger: {
        trigger: "play",
      },
      source: {
        selector: "self",
      },
      effects: [
        {
          effect: "trashFromDeck",
          player: "friendly",
          amount: 3,
          // Publish the just-trashed card ids so the next effect can pick a
          // Unit "from among them" rather than from the whole trash.
          outputBinding: "trashedCards",
        },
        {
          effect: "moveCard",
          target: {
            selector: "bound",
            id: "trashedCards",
            cardTypes: ["unit"],
            selection: {
              mode: "choose",
              min: 1,
              max: 1,
            },
          },
          destination: "hand",
        },
      ],
    },
  ],
  reminderText: ["Discard programs after they resolve."],
}) satisfies ProgramCardDefinition;
