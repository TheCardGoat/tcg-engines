import type { ItemCard } from "@tcg/lorcana-types";
import { sourceOfTheVineI18n } from "./072-source-of-the-vine.i18n";

export const sourceOfTheVine: ItemCard = {
  id: "Srm",
  canonicalId: "ci_Srm",
  slug: "lorcana-ci_Srm",
  printings: [
    {
      id: "set13-072",
      artId: "set13-072",
      setCode: "set13",
      collectorNumber: "72",
      rarity: "common",
      imageUrl: "",
    },
  ],
  reprints: ["set13-072"],
  cardType: "item",
  name: "Source of the Vine",
  inkType: ["amethyst"],
  franchise: "Lorcana",
  set: "013",
  cardNumber: 72,
  rarity: "common",
  cost: 4,
  inkable: false,
  externalIds: {
    lorcast: "crd_87d57ff7547647d0a7e44061cb55efd8",
  },
  text: [
    {
      title: "SIPHON",
      description:
        "Whenever an opposing character quests, you gain 1 lore unless their player pays 1 {I}.",
    },
    {
      title: "RADIANT BLOOM",
      description: "{E}, 2 {I} — Gain 1 lore.",
    },
  ],
  abilities: [
    {
      type: "triggered",
      name: "SIPHON",
      text: "SIPHON Whenever an opposing character quests, you gain 1 lore unless their player pays 1 {I}.",
      trigger: {
        event: "quest",
        on: "OPPONENT_CHARACTERS",
        timing: "whenever",
      },
      effect: {
        type: "or",
        chooser: "OPPONENT",
        optionLabels: ["Pay 1 {I}", "Source of the Vine's controller gains 1 lore"],
        options: [
          {
            type: "pay-cost",
            cost: {
              ink: 1,
            },
            effect: {
              type: "sequence",
              steps: [],
            },
          },
          {
            type: "gain-lore",
            amount: 1,
            target: "CONTROLLER",
          },
        ],
      },
    },
    {
      type: "activated",
      name: "RADIANT BLOOM",
      text: "RADIANT BLOOM {E}, 2 {I} — Gain 1 lore.",
      cost: {
        exert: true,
        ink: 2,
      },
      effect: {
        type: "gain-lore",
        amount: 1,
        target: "CONTROLLER",
      },
    },
  ],
  i18n: sourceOfTheVineI18n,
};
