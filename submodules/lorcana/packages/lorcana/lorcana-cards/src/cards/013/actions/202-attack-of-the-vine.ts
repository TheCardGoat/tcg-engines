import type { ActionCard } from "@tcg/lorcana-types";
import { attackOfTheVineI18n } from "./202-attack-of-the-vine.i18n";

export const attackOfTheVine: ActionCard = {
  id: "MBy",
  canonicalId: "ci_MBy",
  slug: "lorcana-ci_MBy",
  printings: [
    {
      id: "set13-202",
      artId: "set13-202",
      setCode: "set13",
      collectorNumber: "202",
      rarity: "rare",
      imageUrl: "",
    },
  ],
  reprints: ["set13-202"],
  cardType: "action",
  name: "Attack of the Vine!",
  inkType: ["steel"],
  franchise: "Monsters, Inc.",
  set: "013",
  cardNumber: 202,
  rarity: "rare",
  cost: 6,
  inkable: false,
  text: "Your Floodborn characters gain Resist +2 and can challenge ready characters this turn.",
  abilities: [
    {
      type: "action",
      text: "Your Floodborn characters gain Resist +2 and can challenge ready characters this turn.",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "gain-keyword",
            keyword: "Resist",
            value: 2,
            duration: "this-turn",
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
          {
            type: "grant-ability",
            ability: "can-challenge-ready",
            duration: "this-turn",
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
        ],
      },
    },
  ],
  i18n: attackOfTheVineI18n,
};
