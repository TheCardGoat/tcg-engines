import type { LocationCard } from "@tcg/lorcana-types";
import { beastsCastleOverrunByTheVineI18n } from "./141-beasts-castle-overrun-by-the-vine.i18n";

export const beastsCastleOverrunByTheVine: LocationCard = {
  id: "pbQ",
  canonicalId: "ci_pbQ",
  slug: "lorcana-ci_pbQ",
  printings: [
    {
      id: "set13-141",
      artId: "set13-141",
      setCode: "set13",
      collectorNumber: "141",
      rarity: "rare",
      imageUrl: "",
    },
  ],
  reprints: ["set13-141"],
  cardType: "location",
  name: "Beast's Castle",
  version: "Overrun by the Vine",
  inkType: ["ruby"],
  franchise: "Beauty and the Beast",
  set: "013",
  cardNumber: 141,
  rarity: "rare",
  cost: 4,
  willpower: 7,
  moveCost: 2,
  lore: 1,
  inkable: false,
  text: [
    {
      title: "Imminent Threat",
      description:
        "Your Floodborn characters gain Rush. (They can challenge the turn they're played.)",
    },
  ],
  abilities: [
    {
      type: "static",
      name: "IMMINENT THREAT",
      text: "IMMINENT THREAT Your Floodborn characters gain Rush.",
      effect: {
        type: "gain-keyword",
        keyword: "Rush",
        target: {
          selector: "all",
          count: "all",
          owner: "you",
          zones: ["play"],
          cardTypes: ["character"],
          filter: [
            {
              type: "has-classification",
              classification: "Floodborn",
            },
          ],
        },
      },
    },
  ],
  i18n: beastsCastleOverrunByTheVineI18n,
};
