import type { ActionCard } from "@tcg/lorcana-types";
import { unPocoLocoI18n } from "./063-un-poco-loco.i18n";

import { singTogether } from "../../../helpers/abilities/singTogether";

export const unPocoLoco: ActionCard = {
  id: "7PJ",
  canonicalId: "ci_7PJ",
  slug: "lorcana-ci_7PJ",
  printings: [
    {
      id: "set14-063",
      artId: "set14-063",
      setCode: "set14",
      collectorNumber: "63",
      rarity: "rare",
      imageUrl: "",
    },
  ],
  reprints: ["set14-063"],
  cardType: "action",
  name: "Un Poco Loco",
  inkType: ["amethyst"],
  franchise: "Coco",
  set: "014",
  cardNumber: 63,
  rarity: "rare",
  cost: 3,
  inkable: true,
  text: [
    {
      title: "Sing Together 3",
      description:
        "(Any number of your or your teammates' characters with total cost 3 or more may {E} to sing this song for free.)",
    },
    {
      title:
        "Choose 2 characters of yours. If one of them is cost 3 or less, return both to your hand.",
    },
  ],
  actionSubtype: "song",
  abilities: [
    singTogether(3),
    {
      type: "action",
      text: "Choose 2 characters of yours. If one of them is cost 3 or less, return both to your hand.",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "select-target",
            target: {
              selector: "chosen",
              count: 2,
              owner: "you",
              zones: ["play"],
              cardTypes: ["character"],
            },
          },
          {
            type: "conditional",
            condition: {
              type: "target-query",
              query: {
                selector: "all",
                reference: "selected-all",
                filters: [
                  {
                    type: "cost-comparison",
                    comparison: "less-or-equal",
                    value: 3,
                  },
                ],
              },
              comparison: {
                operator: "gte",
                value: 1,
              },
            },
            then: {
              type: "return-to-hand",
              target: {
                reference: "selected-all",
              },
            },
          },
        ],
      },
    },
  ],
  i18n: unPocoLocoI18n,
};
