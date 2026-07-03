import type { CharacterCard } from "@tcg/lorcana-types";
import { theVineToweringStalkI18n } from "./197-the-vine-towering-stalk.i18n";

import { shift } from "../../../helpers/abilities/shift";

export const theVineToweringStalk: CharacterCard = {
  id: "H1d",
  canonicalId: "ci_H1d",
  slug: "lorcana-ci_H1d",
  printings: [
    {
      id: "set13-197",
      artId: "set13-197",
      setCode: "set13",
      collectorNumber: "197",
      rarity: "common",
      imageUrl: "",
    },
  ],
  reprints: ["set13-197"],
  cardType: "character",
  name: "The Vine",
  version: "Towering Stalk",
  inkType: ["steel"],
  set: "013",
  cardNumber: 197,
  rarity: "common",
  cost: 10,
  strength: 10,
  willpower: 10,
  lore: 3,
  inkable: true,
  externalIds: {
    lorcast: "crd_50500ac5aee74cc590b870231c6dd497",
  },
  text: [
    {
      title: "Floodborn Shift 7 {I}",
      description: "(You may pay 7 {I} to play this on top of one of your Floodborn characters.)",
    },
    {
      title: "SATURATE",
      description: "Your other exerted Floodborn characters gain Bodyguard.",
    },
    {
      title: "HOSTILE SWARM",
      description:
        "During an opponent's turn, whenever one of your Floodborn characters is banished, deal 1 damage to each opposing character.",
    },
  ],
  classifications: ["Floodborn"],
  abilities: [
    shift(7),
    {
      type: "static",
      name: "SATURATE",
      text: "SATURATE Your other exerted Floodborn characters gain Bodyguard.",
      effect: {
        type: "gain-keyword",
        keyword: "Bodyguard",
        target: {
          selector: "all",
          count: "all",
          owner: "you",
          zones: ["play"],
          cardTypes: ["character"],
          excludeSelf: true,
          filter: [
            {
              type: "has-classification",
              classification: "Floodborn",
            },
            {
              type: "exerted",
            },
          ],
        },
      },
    },
    {
      type: "triggered",
      name: "HOSTILE SWARM",
      text: "HOSTILE SWARM During an opponent's turn, whenever one of your Floodborn characters is banished, deal 1 damage to each opposing character.",
      trigger: {
        event: "banish",
        on: {
          controller: "you",
          cardType: "character",
          filters: [{ type: "has-classification", classification: "Floodborn" }],
        },
        timing: "whenever",
        restrictions: [
          {
            type: "during-turn",
            whose: "opponent",
          },
        ],
      },
      effect: {
        type: "deal-damage",
        amount: 1,
        target: {
          selector: "all",
          count: "all",
          owner: "opponent",
          zones: ["play"],
          cardTypes: ["character"],
        },
      },
    },
  ],
  i18n: theVineToweringStalkI18n,
};
