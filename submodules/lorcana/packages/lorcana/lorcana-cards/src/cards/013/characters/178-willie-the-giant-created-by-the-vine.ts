import type { CharacterCard } from "@tcg/lorcana-types";
import { willieTheGiantCreatedByTheVineI18n } from "./178-willie-the-giant-created-by-the-vine.i18n";

export const willieTheGiantCreatedByTheVine: CharacterCard = {
  id: "jjR",
  canonicalId: "ci_jjR",
  slug: "lorcana-ci_jjR",
  printings: [
    {
      id: "set13-178",
      artId: "set13-178",
      setCode: "set13",
      collectorNumber: "178",
      rarity: "uncommon",
      imageUrl: "",
    },
  ],
  reprints: ["set13-178"],
  cardType: "character",
  name: "Willie the Giant",
  version: "Created by the Vine",
  inkType: ["steel"],
  set: "013",
  cardNumber: 178,
  rarity: "uncommon",
  cost: 6,
  strength: 6,
  willpower: 3,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_fa625dce7d994607aa2f211dacc7f583",
  },
  text: [
    {
      title: "DEFEND THE STALK",
      description: "Your Floodborn characters gain Resist +1.",
    },
  ],
  classifications: ["Floodborn", "Giant", "Vineling"],
  abilities: [
    {
      type: "static",
      name: "DEFEND THE STALK",
      text: "DEFEND THE STALK Your Floodborn characters gain Resist +1.",
      effect: {
        type: "gain-keyword",
        keyword: "Resist",
        value: 1,
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
  i18n: willieTheGiantCreatedByTheVineI18n,
};
