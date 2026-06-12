import type { ActionCard } from "@tcg/lorcana-types";
import { i2iI18n } from "./130-i2i.i18n";

export const i2i: ActionCard = {
  id: "9NO",
  canonicalId: "ci_buH",
  reprints: ["set9-130"],
  cardType: "action",
  name: "I2I",
  inkType: ["ruby"],
  franchise: "Goofy Movie",
  set: "009",
  cardNumber: 130,
  rarity: "rare",
  cost: 9,
  inkable: true,
  externalIds: {
    lorcast: "crd_d2d94d7cffe349d9a618f8bdb6695f29",
    tcgPlayer: 651116,
  },
  text: [
    {
      title: "Sing Together 9",
      description:
        "(Any number of your or your teammates' characters with total cost 9 or more may {E} to sing this song for free.)",
    },
    {
      title:
        "Each player draws 2 cards and gains 2 lore. If 2 or more characters sang this song, ready them. They can't quest for the rest of this turn.",
    },
  ],
  actionSubtype: "song",
  abilities: [
    {
      type: "action",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "draw",
            amount: 2,
            target: "EACH_PLAYER",
          },
          {
            type: "gain-lore",
            amount: 2,
            target: "EACH_PLAYER",
          },
          {
            type: "conditional",
            condition: {
              type: "play-context",
              context: "characters-sang-this-song",
              comparison: {
                operator: "gte",
                value: 2,
              },
            },
            then: {
              type: "sequence",
              steps: [
                {
                  type: "ready",
                  target: {
                    selector: "all",
                    count: "all",
                    reference: "singers",
                  },
                },
                {
                  type: "restriction",
                  restriction: "cant-quest",
                  duration: "this-turn",
                  target: {
                    selector: "all",
                    count: "all",
                    reference: "singers",
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
  i18n: i2iI18n,
};
