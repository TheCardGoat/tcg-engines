import type { CharacterCard } from "@tcg/lorcana-types";
import { lefouBumblerI18n } from "./008-lefou-bumbler.i18n";

export const lefouBumbler: CharacterCard = {
  id: "irS",
  canonicalId: "ci_irS",
  reprints: ["set1-008"],
  cardType: "character",
  name: "LeFou",
  version: "Bumbler",
  inkType: ["amber"],
  franchise: "Beauty and the Beast",
  set: "001",
  cardNumber: 8,
  rarity: "uncommon",
  cost: 2,
  strength: 1,
  willpower: 2,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_5a1091c1a03c43d4854b66426d49aa10",
    tcgPlayer: 492738,
  },
  text: [
    {
      title: "LOYAL",
      description:
        "If you have a character named Gaston in play, you pay 1 {I} less to play this character.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
  abilities: [
    {
      condition: {
        controller: "you",
        name: "Gaston",
        type: "has-named-character",
      },
      effect: {
        amount: 1,
        cardType: "character",
        type: "cost-reduction",
      },
      id: "9i4-1",
      name: "LOYAL",
      sourceZones: ["hand"],
      text: "LOYAL If you have a character named Gaston in play, you pay 1 {I} less to play this character.",
      type: "static",
    },
  ],
  i18n: lefouBumblerI18n,
};
