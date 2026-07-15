import type { ItemCard } from "@tcg/lorcana-types";
import { screamCanisterI18n } from "./139-scream-canister.i18n";

export const screamCanister: ItemCard = {
  id: "K9I",
  canonicalId: "ci_K9I",
  slug: "lorcana-ci_K9I",
  printings: [
    {
      id: "set13-139",
      artId: "set13-139",
      setCode: "set13",
      collectorNumber: "139",
      rarity: "uncommon",
      imageUrl: "",
    },
  ],
  reprints: ["set13-139"],
  cardType: "item",
  name: "Scream Canister",
  inkType: ["ruby"],
  franchise: "Monsters, Inc.",
  set: "013",
  cardNumber: 139,
  rarity: "uncommon",
  cost: 2,
  inkable: false,
  text: [
    {
      title: "Erratic Screams",
      description:
        "{E}, 2 {I} — Exert all cards in your inkwell. Exert chosen opposing character with 2 {S} or less.",
    },
  ],
  abilities: [
    {
      id: "K9I-1",
      name: "ERRATIC SCREAMS",
      type: "activated",
      cost: {
        exert: true,
        ink: 2,
      },
      effect: {
        type: "sequence",
        steps: [
          {
            type: "exert",
            target: {
              selector: "all",
              count: "all",
              owner: "you",
              zones: ["inkwell"],
            },
          },
          {
            type: "exert",
            target: {
              selector: "chosen",
              count: 1,
              owner: "opponent",
              zones: ["play"],
              cardTypes: ["character"],
              filter: [
                {
                  type: "strength-comparison",
                  comparison: "less-or-equal",
                  value: 2,
                },
              ],
            },
          },
        ],
      },
      text: "ERRATIC SCREAMS {E}, 2 {I} - Exert all cards in your inkwell. Exert chosen opposing character with 2 {S} or less.",
    },
  ],
  i18n: screamCanisterI18n,
};
