import type { ItemCard } from "@tcg/lorcana-types";
import { closetDoorPortalI18n } from "./170-closet-door-portal.i18n";

export const closetDoorPortal: ItemCard = {
  id: "NTO",
  canonicalId: "ci_NTO",
  slug: "lorcana-ci_NTO",
  printings: [
    {
      id: "set13-170",
      artId: "set13-170",
      setCode: "set13",
      collectorNumber: "170",
      rarity: "common",
      imageUrl: "",
    },
  ],
  reprints: ["set13-170"],
  cardType: "item",
  name: "Closet Door Portal",
  inkType: ["sapphire"],
  franchise: "Monsters, Inc.",
  set: "013",
  cardNumber: 170,
  rarity: "common",
  cost: 4,
  inkable: false,
  text: [
    {
      title: "Knock, Knock",
      description: "This item enters play exerted.",
    },
    {
      title: "Who's There?",
      description:
        "{E}, 2 {I} — Look at the top 3 cards of your deck. You may reveal a character, item, or location card with cost 6 or less and play it for free. Put the rest on the bottom of your deck in any order. Put this card into your inkwell facedown and exerted.",
    },
  ],
  abilities: [
    {
      type: "static",
      name: "KNOCK, KNOCK",
      text: "KNOCK, KNOCK This item enters play exerted.",
      effect: {
        type: "restriction",
        restriction: "enters-play-exerted",
        target: "SELF",
      },
    },
    {
      type: "activated",
      name: "WHO'S THERE?",
      text: "WHO'S THERE? {E}, 2 {I} — Look at the top 3 cards of your deck. You may reveal a character, item, or location card with cost 6 or less and play it for free. Put the rest on the bottom of your deck in any order. Put this card into your inkwell facedown and exerted.",
      cost: {
        exert: true,
        ink: 2,
      },
      effect: {
        type: "sequence",
        steps: [
          {
            type: "scry",
            amount: 3,
            target: "CONTROLLER",
            destinations: [
              {
                zone: "play",
                min: 0,
                max: 1,
                reveal: true,
                cost: "free",
                filter: {
                  type: "or",
                  filters: [
                    {
                      type: "card-type",
                      cardType: "character",
                    },
                    {
                      type: "card-type",
                      cardType: "item",
                    },
                    {
                      type: "card-type",
                      cardType: "location",
                    },
                  ],
                },
                playFilters: [
                  {
                    type: "cost",
                    comparison: "lte",
                    value: 6,
                  },
                ],
              },
              {
                zone: "deck-bottom",
                remainder: true,
              },
            ],
          },
          {
            type: "put-into-inkwell",
            source: "this-card",
            target: "CONTROLLER",
            facedown: true,
            exerted: true,
          },
        ],
      },
    },
  ],
  i18n: closetDoorPortalI18n,
};
