import type { CharacterCard } from "@tcg/op-types";
import { eb03Yamato057I18n } from "./057-yamato.i18n.ts";

export const eb03Yamato057: CharacterCard = {
  id: "EB03-057",
  cardType: "character",
  color: ["yellow"],
  rarity: "R",
  setId: "EB03",
  cost: 5,
  power: 6000,
  counter: 1000,
  traits: ["Land of Wano"],
  attribute: "strike",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB03-057_p1_bBwaxOz.jpg",
      imageId: "EB03-057_p1",
    },
  ],
  effect:
    "[On Play] Give up to 3 rested DON!! cards to your {Land of Wano} type Leader.\n[On K.O.] Trash up to 1 card from the top of your opponent's Life cards.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "giveDon",
            target: {
              player: "self",
              zones: ["leader"],
              count: {
                amount: 1,
              },
              filters: [
                {
                  filter: "trait",
                  value: "Land of Wano",
                },
              ],
            },
            count: {
              amount: 3,
              upTo: true,
            },
            donState: "rested",
          },
        ],
      },
      {
        trigger: "onKo",
        actions: [
          {
            action: "removeFromLife",
            player: "opponent",
            count: {
              amount: 1,
              upTo: true,
            },
            destination: "trash",
          },
        ],
      },
    ],
  },
  i18n: eb03Yamato057I18n,
};
