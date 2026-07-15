import type { CharacterCard } from "@tcg/lorcana-types";
import { robinHoodCreatedByTheVineI18n } from "./159-robin-hood-created-by-the-vine.i18n";

export const robinHoodCreatedByTheVine: CharacterCard = {
  id: "0c7",
  canonicalId: "ci_0c7",
  slug: "lorcana-ci_0c7",
  printings: [
    {
      id: "set13-159",
      artId: "set13-159",
      setCode: "set13",
      collectorNumber: "159",
      rarity: "common",
      imageUrl: "",
    },
  ],
  reprints: ["set13-159"],
  cardType: "character",
  name: "Robin Hood",
  version: "Created by the Vine",
  inkType: ["sapphire"],
  franchise: "Robin Hood",
  set: "013",
  cardNumber: 159,
  rarity: "common",
  cost: 5,
  strength: 4,
  willpower: 5,
  lore: 2,
  inkable: true,
  text: [
    {
      title: "Keen-Eyed",
      description:
        "Your Floodborn characters gain Alert. (They can challenge as if they had Evasive.)",
    },
  ],
  classifications: ["Floodborn", "Vineling"],
  abilities: [
    {
      type: "static",
      name: "KEEN-EYED",
      text: "KEEN-EYED Your Floodborn characters gain Alert.",
      effect: {
        type: "gain-keyword",
        keyword: "Alert",
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
  i18n: robinHoodCreatedByTheVineI18n,
};
