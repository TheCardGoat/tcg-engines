import type { CharacterCard } from "@tcg/lorcana-types";
import { diabloProtectingHisMistressI18n } from "./193-diablo-protecting-his-mistress.i18n";

export const diabloProtectingHisMistress: CharacterCard = {
  id: "mTj",
  canonicalId: "ci_mTj",
  slug: "lorcana-ci_mTj",
  printings: [
    {
      id: "set13-193",
      artId: "set13-193",
      setCode: "set13",
      collectorNumber: "193",
      rarity: "common",
      imageUrl: "",
    },
  ],
  reprints: ["set13-193"],
  cardType: "character",
  name: "Diablo",
  version: "Protecting His Mistress",
  inkType: ["steel"],
  franchise: "Sleeping Beauty",
  set: "013",
  cardNumber: 193,
  rarity: "common",
  cost: 2,
  strength: 3,
  willpower: 2,
  lore: 1,
  inkable: true,
  text: [
    {
      title: "Flurry of Feathers",
      description: "Your characters named Maleficent gain Resist +1.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
  abilities: [
    {
      type: "static",
      name: "FLURRY OF FEATHERS",
      text: "FLURRY OF FEATHERS Your characters named Maleficent gain Resist +1.",
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
              type: "has-name",
              name: "Maleficent",
            },
          ],
        },
      },
    },
  ],
  i18n: diabloProtectingHisMistressI18n,
};
