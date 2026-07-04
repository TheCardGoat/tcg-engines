import type { ActionCard } from "@tcg/lorcana-types";
import { i2iEnchantedI18n } from "./234-i2i-enchanted.i18n";

export const i2iEnchanted: ActionCard = {
  id: "vZz",
  canonicalId: "ci_buH",
  slug: "lorcana-ci_buH",
  printings: [
    {
      id: "set9-234-enchanted",
      artId: "ci_buH-enchanted",
      setCode: "set9",
      collectorNumber: "234",
      rarity: "enchanted",
      imageUrl: "",
    },
  ],
  reprints: ["set9-130"],
  cardType: "action",
  name: "I2I",
  inkType: ["ruby"],
  franchise: "Goofy Movie",
  set: "009",
  cardNumber: 234,
  rarity: "enchanted",
  specialRarity: "enchanted",
  cost: 9,
  inkable: true,
  externalIds: {
    lorcast: "crd_d2d94d7cffe349d9a618f8bdb6695f29",
    tcgPlayer: "651116",
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
  i18n: i2iEnchantedI18n,
};
