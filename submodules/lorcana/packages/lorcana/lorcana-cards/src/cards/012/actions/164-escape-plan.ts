import type { ActionCard } from "@tcg/lorcana-types";
import { escapePlanI18n } from "./164-escape-plan.i18n";

export const escapePlan: ActionCard = {
  id: "6F2",
  canonicalId: "ci_6F2",
  reprints: ["set12-164"],
  cardType: "action",
  name: "Escape Plan",
  inkType: ["sapphire"],
  franchise: "Atlantis",
  set: "012",
  cardNumber: 164,
  rarity: "rare",
  cost: 5,
  inkable: false,

  externalIds: {
    lorcast: "crd_85de0815b3344000a8f380b6ceefc07e",
  },
  text: [
    {
      title:
        "You can't play this action unless 2 or more cards were put into your discard this turn.",
    },
    {
      title:
        "Each player chooses 2 of their characters and puts them into their inkwell facedown and exerted.",
    },
  ],
  abilities: [
    {
      type: "static",
      effect: {
        type: "self-play-condition",
      },
      condition: {
        type: "turn-metric",
        metric: "discard-cards-entered",
        ownerScope: "you",
        comparison: {
          operator: "gte",
          value: 2,
        },
      },
      sourceZones: ["hand"],
    },
    {
      type: "action",
      text: "Each player chooses 2 of their characters and puts them into their inkwell facedown and exerted.",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "put-into-inkwell",
            source: "chosen-character",
            exerted: true,
            facedown: true,
            chosenBy: "you",
            target: {
              selector: "chosen",
              count: 2,
              owner: "you",
              zones: ["play"],
              cardTypes: ["character"],
            },
          },
          {
            type: "for-each-opponent",
            effect: {
              type: "put-into-inkwell",
              source: "chosen-character",
              exerted: true,
              facedown: true,
              chosenBy: "opponent",
              target: {
                selector: "chosen",
                count: 2,
                owner: "opponent",
                zones: ["play"],
                cardTypes: ["character"],
              },
            },
          },
        ],
      },
    },
  ],
  i18n: escapePlanI18n,
};
