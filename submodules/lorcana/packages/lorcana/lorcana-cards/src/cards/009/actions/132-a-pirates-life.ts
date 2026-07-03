import type { ActionCard } from "@tcg/lorcana-types";
import { aPiratesLifeI18n } from "./132-a-pirates-life.i18n";

export const aPiratesLife: ActionCard = {
  id: "ek3",
  canonicalId: "ci_rfx",
  slug: "lorcana-ci_rfx",
  printings: [
    {
      id: "set9-132",
      artId: "set9-132",
      setCode: "set9",
      collectorNumber: "132",
      rarity: "uncommon",
      imageUrl: "",
    },
  ],
  reprints: ["set4-128", "set9-132"],
  cardType: "action",
  name: "A Pirate’s Life",
  inkType: ["ruby"],
  franchise: "Peter Pan",
  set: "009",
  cardNumber: 132,
  rarity: "uncommon",
  cost: 6,
  inkable: true,
  externalIds: {
    lorcast: "crd_480463cc9e3f4f7b9cb1c96a83d69544",
    tcgPlayer: "650067",
  },
  text: [
    {
      title:
        "<Sing Together> 6 (Any number of your or your teammates' characters with total cost 6 or more may {E} to sing this song for free.)",
    },
    {
      title: "Each opponent loses 2 lore. You gain 2 lore.",
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
            type: "lose-lore",
            amount: 2,
            target: "EACH_OPPONENT",
          },
          {
            type: "gain-lore",
            amount: 2,
            target: "CONTROLLER",
          },
        ],
      },
    },
  ],
  i18n: aPiratesLifeI18n,
};
