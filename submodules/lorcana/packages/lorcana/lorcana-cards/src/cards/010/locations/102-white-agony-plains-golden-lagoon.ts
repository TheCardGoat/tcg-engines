import type { LocationCard } from "@tcg/lorcana-types";
import { whiteAgonyPlainsGoldenLagoonI18n } from "./102-white-agony-plains-golden-lagoon.i18n";

export const whiteAgonyPlainsGoldenLagoon: LocationCard = {
  id: "4XD",
  canonicalId: "ci_4XD",
  reprints: ["set10-102"],
  cardType: "location",
  name: "White Agony Plains",
  version: "Golden Lagoon",
  inkType: ["emerald"],
  franchise: "Ducktales",
  set: "010",
  cardNumber: 102,
  rarity: "rare",
  cost: 2,
  willpower: 7,
  moveCost: 1,
  lore: 0,
  inkable: true,
  externalIds: {
    lorcast: "crd_4296f5bd9774451e920827cc374b8981",
    tcgPlayer: 660040,
  },
  text: [
    {
      title: "PURE LIQUID GOLD",
      description: "This location gets +1 {L} for each character here.",
    },
  ],
  abilities: [
    {
      id: "4XD-1",
      name: "PURE LIQUID GOLD",
      text: "PURE LIQUID GOLD This location gets +1 {L} for each character here.",
      type: "static",
      effect: {
        type: "modify-stat",
        stat: "lore",
        modifier: {
          type: "filtered-count",
          owner: "any",
          zones: ["play"],
          cardType: "character",
          filters: [
            {
              type: "same-location-as-source",
            },
          ],
        },
        target: "SELF",
      },
    },
  ],
  i18n: whiteAgonyPlainsGoldenLagoonI18n,
};
