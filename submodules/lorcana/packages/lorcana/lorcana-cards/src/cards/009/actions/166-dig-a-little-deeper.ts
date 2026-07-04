import type { ActionCard } from "@tcg/lorcana-types";
import { digALittleDeeperI18n } from "./166-dig-a-little-deeper.i18n";

export const digALittleDeeper: ActionCard = {
  id: "PkI",
  canonicalId: "ci_VM4",
  slug: "lorcana-ci_VM4",
  printings: [
    {
      id: "set9-166",
      artId: "set9-166",
      setCode: "set9",
      collectorNumber: "166",
      rarity: "uncommon",
      imageUrl: "",
    },
  ],
  reprints: ["set4-162", "set9-166"],
  cardType: "action",
  name: "Dig a Little Deeper",
  inkType: ["sapphire"],
  franchise: "Princess and the Frog",
  set: "009",
  cardNumber: 166,
  rarity: "uncommon",
  cost: 8,
  inkable: false,
  externalIds: {
    lorcast: "crd_7dc546270337447fb4c4bac833fc4c17",
    tcgPlayer: "650100",
  },
  text: [
    {
      title: "Sing Together 8",
      description:
        "(Any number of your or your teammates' characters with total cost 8 or more may {E} to sing this song for free.) Look at the top 7 cards of your deck. Put 2 into your hand and the rest on the bottom of your deck in any order.",
    },
  ],
  actionSubtype: "song",
  abilities: [
    {
      type: "action",
      effect: {
        type: "scry",
        amount: 7,
        target: "CONTROLLER",
        destinations: [
          {
            zone: "hand",
            min: 2,
            max: 2,
          },
          {
            zone: "deck-bottom",
            remainder: true,
            ordering: "player-choice",
          },
        ],
      },
    },
  ],
  i18n: digALittleDeeperI18n,
};
