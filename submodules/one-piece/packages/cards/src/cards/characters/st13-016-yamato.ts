import type { CharacterCard } from "@tcg/op-types";
import { st13Yamato016I18n } from "./st13-016-yamato.i18n.ts";
export const st13Yamato016: CharacterCard = {
  id: "ST13-016",
  canonicalId: "ST13-016",
  slug: "yamato/st13-016",
  name: "Yamato",
  printings: [
    {
      id: "ST13-016",
      artId: "ST13-016",
      setCode: "ST13",
      collectorNumber: "016",
      rarity: "C",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/ST13-016.png",
    },
  ],
  cardType: "character",
  color: ["yellow"],
  rarity: "C",
  setId: "ST13",
  cost: 5,
  power: 4000,
  counter: 2000,
  traits: ["Land of Wano"],
  attribute: "strike",
  effect:
    "[Rush] (This card can attack on the turn in which it is played.) [On Play] Look at all your Life cards; place 1 at the top of your deck and place the rest back in your Life area in any order.",
  effects: {
    keywords: ["rush"],
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "rearrangeLife",
            player: "self",
            moveOneToDeckTop: true,
          },
        ],
      },
    ],
  },
  i18n: st13Yamato016I18n,
};
