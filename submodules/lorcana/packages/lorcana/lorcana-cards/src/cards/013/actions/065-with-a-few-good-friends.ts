import type { ActionCard } from "@tcg/lorcana-types";
import { withAFewGoodFriendsI18n } from "./065-with-a-few-good-friends.i18n";

import { singTogether } from "../../../helpers/abilities/singTogether";

export const withAFewGoodFriends: ActionCard = {
  id: "QV6",
  canonicalId: "ci_QV6",
  slug: "lorcana-ci_QV6",
  printings: [
    {
      id: "set13-065",
      artId: "set13-065",
      setCode: "set13",
      collectorNumber: "65",
      rarity: "rare",
      imageUrl: "",
    },
  ],
  reprints: ["set13-065"],
  cardType: "action",
  name: "With a Few Good Friends",
  inkType: ["amethyst"],
  franchise: "Winnie the Pooh",
  set: "013",
  cardNumber: 65,
  rarity: "rare",
  cost: 6,
  inkable: true,
  externalIds: {
    lorcast: "crd_9c14d6ee5bfd49538ccf3d3323baac68",
  },
  text: [
    {
      title: "Sing Together 6",
      description:
        "(Any number of your or your teammates' characters with total cost 6 or more may {} to sing this song for free.)",
    },
    {
      title:
        "Chosen player draws a card for each different ink type of characters you have in play.",
    },
  ],
  actionSubtype: "song",
  abilities: [
    singTogether(6),
    {
      type: "action",
      text: "Chosen player draws a card for each different ink type of characters you have in play.",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "count",
            what: "distinct-character-ink-types",
            controller: "you",
          },
          {
            type: "draw",
            amount: {
              type: "trigger-amount",
            },
            target: "CHOSEN_PLAYER",
          },
        ],
      },
    },
  ],
  i18n: withAFewGoodFriendsI18n,
};
