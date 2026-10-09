import type { ActionCard } from "@tcg/lorcana-types";
import { neverTooFarApartI18n } from "./028-never-too-far-apart.i18n";

import { singTogether } from "../../../helpers/abilities/singTogether";

export const neverTooFarApart: ActionCard = {
  id: "x16",
  canonicalId: "ci_x16",
  slug: "lorcana-ci_x16",
  printings: [
    {
      id: "set14-028",
      artId: "set14-028",
      setCode: "set14",
      collectorNumber: "28",
      rarity: "rare",
      imageUrl: "",
    },
  ],
  reprints: ["set14-028"],
  cardType: "action",
  name: "Never Too Far Apart",
  inkType: ["amber"],
  franchise: "Goofy Movie",
  set: "014",
  cardNumber: 28,
  rarity: "rare",
  cost: 9,
  inkable: true,
  text: [
    {
      title: "Sing Together 9",
      description:
        "(Any number of your or your teammates' characters with total cost 9 or more may {E} to sing this song for free.)",
    },
    {
      title:
        "Look at the top 9 cards of your deck. Reveal up to 3 character cards with Singer and put them into your hand. Put the rest on the bottom of your deck in any order.",
    },
  ],
  actionSubtype: "song",
  abilities: [
    singTogether(9),
    {
      type: "action",
      text: "Look at the top 9 cards of your deck. Reveal up to 3 character cards with Singer and put them into your hand. Put the rest on the bottom of your deck in any order.",
      effect: {
        type: "scry",
        amount: 9,
        target: "CONTROLLER",
        destinations: [
          {
            zone: "hand",
            min: 0,
            max: 3,
            reveal: true,
            filters: [
              {
                type: "card-type",
                cardType: "character",
              },
              {
                type: "has-keyword",
                keyword: "Singer",
              },
            ],
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
  i18n: neverTooFarApartI18n,
};
