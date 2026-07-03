import type { ActionCard } from "@tcg/lorcana-types";
import { imNeverNotByYourSideI18n } from "./033-im-never-not-by-your-side.i18n";

import { singTogether } from "../../../helpers/abilities/singTogether";

export const imNeverNotByYourSide: ActionCard = {
  id: "P8M",
  canonicalId: "ci_P8M",
  slug: "lorcana-ci_P8M",
  printings: [
    {
      id: "set13-033",
      artId: "set13-033",
      setCode: "set13",
      collectorNumber: "33",
      rarity: "uncommon",
      imageUrl: "",
    },
  ],
  reprints: ["set13-033"],
  cardType: "action",
  name: "I'm Never Not by Your Side",
  inkType: ["amber"],
  franchise: "Turning Red",
  set: "013",
  cardNumber: 33,
  rarity: "uncommon",
  cost: 5,
  inkable: true,
  externalIds: {
    lorcast: "crd_92181e78a3aa43c98284aab9ca52368f",
  },
  text: [
    {
      title:
        "<Sing Together> 5 (Any number of your or your teammates' characters with total cost 5 or more may {E} to sing this song for free.)",
    },
    {
      title:
        "Remove up to 4 damage total from any number of your characters. You gain 1 lore for each 1 damage removed this way.",
    },
  ],
  actionSubtype: "song",
  abilities: [
    singTogether(5),
    {
      type: "action",
      text: "Remove up to 4 damage total from any number of your characters. You gain 1 lore for each 1 damage removed this way.",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "remove-damage",
            amount: {
              type: "up-to",
              value: 4,
            },
            distribution: "aggregate",
            target: {
              selector: "chosen",
              count: {
                upTo: 4,
              },
              owner: "you",
              zones: ["play"],
              cardTypes: ["character"],
              filters: [
                {
                  type: "status",
                  status: "damaged",
                },
              ],
            },
          },
          {
            type: "gain-lore",
            amount: {
              type: "for-each",
              counter: {
                type: "damage-removed",
              },
            },
            target: "CONTROLLER",
          },
        ],
      },
    },
  ],
  i18n: imNeverNotByYourSideI18n,
};
