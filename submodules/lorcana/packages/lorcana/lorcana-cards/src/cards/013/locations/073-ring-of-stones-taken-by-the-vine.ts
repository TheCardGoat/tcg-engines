import type { LocationCard } from "@tcg/lorcana-types";
import { ringOfStonesTakenByTheVineI18n } from "./073-ring-of-stones-taken-by-the-vine.i18n";

export const ringOfStonesTakenByTheVine: LocationCard = {
  id: "6Uy",
  canonicalId: "ci_6Uy",
  slug: "lorcana-ci_6Uy",
  printings: [
    {
      id: "set13-073",
      artId: "set13-073",
      setCode: "set13",
      collectorNumber: "73",
      rarity: "rare",
      imageUrl: "",
    },
  ],
  reprints: ["set13-073"],
  cardType: "location",
  name: "Ring of Stones",
  version: "Taken by the Vine",
  inkType: ["amethyst"],
  franchise: "Brave",
  set: "013",
  cardNumber: 73,
  rarity: "rare",
  cost: 4,
  willpower: 7,
  moveCost: 1,
  lore: 1,
  inkable: false,
  externalIds: {
    lorcast: "crd_d6a16f7195a8417d86d5f7b407bb7836",
  },
  text: [
    {
      title: "DEEP WISDOM",
      description: "Your Floodborn characters get +1 lore.",
    },
  ],
  abilities: [
    {
      type: "static",
      name: "DEEP WISDOM",
      text: "DEEP WISDOM Your Floodborn characters get +1 lore.",
      effect: {
        type: "modify-stat",
        stat: "lore",
        modifier: 1,
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
  i18n: ringOfStonesTakenByTheVineI18n,
};
