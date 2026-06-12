import type { LocationCard } from "@tcg/lorcana-types";
import { skullRockIsolatedFortressI18n } from "./136-skull-rock-isolated-fortress.i18n";

export const skullRockIsolatedFortress: LocationCard = {
  id: "ZZ0",
  canonicalId: "ci_ZZ0",
  reprints: ["set6-136"],
  cardType: "location",
  name: "Skull Rock",
  version: "Isolated Fortress",
  inkType: ["ruby"],
  franchise: "Peter Pan",
  set: "006",
  cardNumber: 136,
  rarity: "common",
  cost: 2,
  willpower: 6,
  moveCost: 1,
  lore: 0,
  inkable: true,
  externalIds: {
    lorcast: "crd_5c09e6638f7f4eccaa8ae9cf545702cc",
    tcgPlayer: 591987,
  },
  text: [
    {
      title: "FAMILIAR GROUND",
      description: "Characters get +1 {S} while here.",
    },
    {
      title: "SAFE HAVEN",
      description: "At the start of your turn, if you have a Pirate character here, gain 1 lore.",
    },
  ],
  abilities: [
    {
      effect: {
        modifier: 1,
        stat: "strength",
        target: "CHARACTERS_HERE",
        type: "modify-stat",
      },
      id: "1rj-1",
      name: "FAMILIAR GROUND",
      text: "FAMILIAR GROUND Characters get +1 {S} while here.",
      type: "static",
    },
    {
      condition: {
        type: "target-query",
        query: {
          selector: "all",
          owner: "you",
          zones: ["play"],
          cardType: "character",
          filters: [
            {
              type: "same-location-as-source",
            },
            {
              type: "has-classification",
              classification: "Pirate",
            },
          ],
        },
        comparison: {
          operator: "gte",
          value: 1,
        },
      },
      effect: {
        amount: 1,
        type: "gain-lore",
      },
      id: "1rj-2",
      name: "SAFE HAVEN",
      text: "SAFE HAVEN At the start of your turn, if you have a Pirate character here, gain 1 lore.",
      trigger: {
        event: "start-turn",
        on: "YOU",
        timing: "at",
      },
      type: "triggered",
    },
  ],
  i18n: skullRockIsolatedFortressI18n,
};
