import type { ActionCard } from "@tcg/lorcana-types";
import { friendLikeMeI18n } from "./160-friend-like-me.i18n";

export const friendLikeMe: ActionCard = {
  id: "wbB",
  canonicalId: "ci_wbB",
  reprints: ["set3-160"],
  cardType: "action",
  name: "Friend Like Me",
  inkType: ["sapphire"],
  franchise: "Aladdin",
  set: "003",
  cardNumber: 160,
  rarity: "rare",
  cost: 5,
  inkable: true,
  externalIds: {
    lorcast: "crd_dda178292c7746de913c4dacee008ac9",
    tcgPlayer: 536285,
  },
  text: "Each player puts the top 3 cards of their deck into their inkwell facedown and exerted.",
  actionSubtype: "song",
  abilities: [
    {
      effect: {
        type: "sequence",
        steps: [
          {
            type: "put-into-inkwell",
            source: "top-of-deck",
            target: "EACH_PLAYER",
            facedown: true,
            exerted: true,
          },
          {
            type: "put-into-inkwell",
            source: "top-of-deck",
            target: "EACH_PLAYER",
            facedown: true,
            exerted: true,
          },
          {
            type: "put-into-inkwell",
            source: "top-of-deck",
            target: "EACH_PLAYER",
            facedown: true,
            exerted: true,
          },
        ],
      },
      id: "h7y-1",
      text: "Each player puts the top 3 cards of their deck into their inkwell facedown and exerted.",
      type: "action",
    },
  ],
  i18n: friendLikeMeI18n,
};
