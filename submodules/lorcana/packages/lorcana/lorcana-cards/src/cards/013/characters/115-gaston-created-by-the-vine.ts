import type { CharacterCard } from "@tcg/lorcana-types";
import { gastonCreatedByTheVineI18n } from "./115-gaston-created-by-the-vine.i18n";

export const gastonCreatedByTheVine: CharacterCard = {
  id: "kLX",
  canonicalId: "ci_kLX",
  slug: "lorcana-ci_kLX",
  printings: [
    {
      id: "set13-115",
      artId: "set13-115",
      setCode: "set13",
      collectorNumber: "115",
      rarity: "common",
      imageUrl: "",
    },
  ],
  reprints: ["set13-115"],
  cardType: "character",
  name: "Gaston",
  version: "Created by the Vine",
  inkType: ["ruby"],
  franchise: "Beauty and the Beast",
  set: "013",
  cardNumber: 115,
  rarity: "common",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_e9b42287e4e24f079b2906af28880a46",
  },
  text: [
    {
      title: "DRAWING STRENGTH",
      description: "Your Floodborn characters get +1 {S}.",
    },
  ],
  classifications: ["Floodborn", "Vineling"],
  abilities: [
    {
      type: "static",
      name: "DRAWING STRENGTH",
      text: "DRAWING STRENGTH Your Floodborn characters get +1 {S}.",
      effect: {
        type: "modify-stat",
        stat: "strength",
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
  i18n: gastonCreatedByTheVineI18n,
};
