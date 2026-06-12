import type { CharacterCard } from "@tcg/lorcana-types";
import { zipperFlyingRangerI18n } from "./192-zipper-flying-ranger.i18n";

export const zipperFlyingRanger: CharacterCard = {
  id: "ogS",
  canonicalId: "ci_ogS",
  reprints: ["set8-192"],
  cardType: "character",
  name: "Zipper",
  version: "Flying Ranger",
  inkType: ["steel"],
  franchise: "Rescue Rangers",
  set: "008",
  cardNumber: 192,
  rarity: "uncommon",
  cost: 3,
  strength: 2,
  willpower: 4,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_7a1795d8ea814feb8b1c6bc53a692f78",
    tcgPlayer: 631476,
  },
  text: [
    {
      title: "BEST MATES",
      description:
        "If you have a character named Monterey Jack in play, you pay 1 {I} less to play this character.",
    },
    {
      title: "BURST OF SPEED",
      description:
        "During your turn, this character gains Evasive. (They can challenge characters with Evasive.)",
    },
  ],
  classifications: ["Storyborn", "Ally"],
  abilities: [
    {
      id: "8ix-1",
      name: "BEST MATES",
      text: "BEST MATES If you have a character named Monterey Jack in play, you pay 1 {I} less to play this character.",
      type: "static",
      sourceZones: ["hand"],
      effect: {
        type: "cost-reduction",
        amount: {
          type: "clamp",
          value: {
            type: "filtered-count",
            owner: "you",
            zones: ["play"],
            cardType: "character",
            filters: [
              {
                type: "has-name",
                name: "Monterey Jack",
              },
            ],
          },
          max: 1,
        },
        cardType: "character",
      },
    },
    {
      condition: {
        type: "turn",
        whose: "your",
      },
      effect: {
        keyword: "Evasive",
        target: "SELF",
        type: "gain-keyword",
      },
      id: "8ix-2",
      name: "BURST OF SPEED",
      text: "BURST OF SPEED During your turn, this character gains Evasive.",
      type: "static",
    },
  ],
  i18n: zipperFlyingRangerI18n,
};
