import type { UnitCardDefinition } from "@tcg/cyberpunk-types";
import { defineCyberpunkCard } from "../../define.ts";

export const welcomeToNightCityRetailMaelstromZealots = defineCyberpunkCard({
  id: "35c1fda3-60f9-4779-b690-30b283d52297",
  canonicalId: "maelstrom-zealots",
  slug: "maelstrom-zealots",
  name: "Maelstrom Zealots",
  displayName: "Maelstrom Zealots",
  rulesText:
    "When this Unit loses a fight, defeat the opposing rival Unit.\n(Units with power 0 don't steal Gigs.)",
  color: "green",
  classifications: ["Ganger", "Maelstrom"],
  set: {
    code: "welcometonightcityretail",
    name: "Welcome to Night City — Retail",
  },
  printNumber: "079",
  artist: "Michał Dziekan",
  imageUrl: "https://cdn.tcg.online/public/cyberpunk/cards/welcometonightcityretail/079.webp",
  rarity: "Common",
  legality: "legal",
  hasSellTag: false,
  ram: 1,
  abilities: [
    {
      kind: "triggered",
      text: "When this Unit loses a fight, defeat the opposing rival Unit.",
      trigger: {
        trigger: "event",
        event: {
          event: "fightResolved",
          player: "any",
          result: "defenderWins",
          attacker: {
            selector: "self",
          },
        },
      },
      source: {
        selector: "self",
      },
      effects: [
        {
          effect: "defeat",
          target: {
            selector: "defender",
          },
        },
      ],
    },
    {
      kind: "triggered",
      text: "When this Unit loses a fight, defeat the opposing rival Unit.",
      trigger: {
        trigger: "event",
        event: {
          event: "fightResolved",
          player: "any",
          result: "attackerWins",
          defender: {
            selector: "self",
          },
        },
      },
      source: {
        selector: "self",
      },
      effects: [
        {
          effect: "defeat",
          target: {
            selector: "attacker",
          },
        },
      ],
    },
  ],
  reminderText: ["Units with power 0 don't steal Gigs."],
  type: "unit",
  cost: 4,
  power: 0,
}) satisfies UnitCardDefinition;
