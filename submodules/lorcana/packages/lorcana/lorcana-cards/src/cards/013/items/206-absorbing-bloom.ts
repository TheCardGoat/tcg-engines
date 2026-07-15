import type { ItemCard } from "@tcg/lorcana-types";
import { absorbingBloomI18n } from "./206-absorbing-bloom.i18n";

export const absorbingBloom: ItemCard = {
  id: "Kjs",
  canonicalId: "ci_Kjs",
  slug: "lorcana-ci_Kjs",
  printings: [
    {
      id: "set13-206",
      artId: "set13-206",
      setCode: "set13",
      collectorNumber: "206",
      rarity: "uncommon",
      imageUrl: "",
    },
  ],
  reprints: ["set13-206"],
  cardType: "item",
  name: "Absorbing Bloom",
  inkType: ["steel"],
  franchise: "Peter Pan",
  set: "013",
  cardNumber: 206,
  rarity: "uncommon",
  cost: 2,
  inkable: false,
  text: [
    {
      title: "Metamorphosis",
      description:
        "{E}, 1 {I} — If a character was banished in a challenge this turn, draw a card.",
    },
  ],
  abilities: [
    {
      type: "activated",
      name: "METAMORPHOSIS",
      text: "METAMORPHOSIS {E}, 1 {I} - If a character was banished in a challenge this turn, draw a card.",
      cost: {
        exert: true,
        ink: 1,
      },
      condition: {
        type: "banished-in-challenge-this-turn",
        owner: "any",
      },
      effect: {
        type: "draw",
        amount: 1,
        target: "CONTROLLER",
      },
    },
  ],
  i18n: absorbingBloomI18n,
};
