import type { CharacterCard } from "@tcg/lorcana-types";
import { peteCreatedByTheVineI18n } from "./052-pete-created-by-the-vine.i18n";

export const peteCreatedByTheVine: CharacterCard = {
  id: "jiP",
  canonicalId: "ci_jiP",
  slug: "lorcana-ci_jiP",
  printings: [
    {
      id: "set13-052",
      artId: "set13-052",
      setCode: "set13",
      collectorNumber: "52",
      rarity: "common",
      imageUrl: "",
    },
  ],
  reprints: ["set13-052"],
  cardType: "character",
  name: "Pete",
  version: "Created by the Vine",
  inkType: ["amethyst"],
  set: "013",
  cardNumber: 52,
  rarity: "common",
  cost: 1,
  strength: 1,
  willpower: 2,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_1e710cb07f1e49be9b2b0616bb93b582",
  },
  text: [
    {
      title: "THORNY OVERGROWTH",
      description:
        "Your Floodborn characters gain Challenger +1. (They get +1 {S} while challenging.)",
    },
  ],
  classifications: ["Floodborn", "Vineling"],
  abilities: [
    {
      id: "jiP-1",
      name: "THORNY OVERGROWTH",
      type: "static",
      effect: {
        type: "gain-keyword",
        keyword: "Challenger",
        value: 1,
        target: {
          selector: "all",
          count: "all",
          owner: "you",
          zones: ["play"],
          cardTypes: ["character"],
          filters: [
            {
              type: "has-classification",
              classification: "Floodborn",
            },
          ],
        },
      },
      text: "THORNY OVERGROWTH Your Floodborn characters gain Challenger +1.",
    },
  ],
  i18n: peteCreatedByTheVineI18n,
};
