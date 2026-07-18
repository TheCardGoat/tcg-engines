import type { CharacterCard } from "@tcg/op-types";
import { prb02EdwardNewgateSt13004PirateFoil004I18n } from "./004-edward-newgate-st13-004-pirate-foil.i18n.ts";

export const prb02EdwardNewgateSt13004PirateFoil004: CharacterCard = {
  id: "ST13-004",
  canonicalId: "ST13-004",
  slug: "edward-newgate-st13-004-pirate-foil",
  name: "Edward.Newgate - ST13-004 (Pirate Foil)",
  printings: [
    {
      id: "ST13-004",
      artId: "ST13-004",
      setCode: "PRB02",
      collectorNumber: "004",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/ST13-004_p2.jpg",
    },
    {
      id: "ST13-004_r1",
      artId: "ST13-004_r1",
      setCode: "PRB02",
      collectorNumber: "004",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/ST13-004_r1.jpg",
    },
  ],
  cardType: "character",
  color: ["yellow"],
  rarity: "C",
  setId: "PRB02",
  cost: 6,
  power: 7000,
  counter: 1000,
  traits: ["The Four Emperors Whitebeard Pirates"],
  attribute: "special",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/ST13-004_r1.jpg",
      imageId: "ST13-004_r1",
    },
  ],
  effect:
    "[On Play] Add 1 card from the top of your deck to the top of your Life cards. Then, look at all your Life cards; place 1 card at the top of your deck and place the rest back in your Life area in any order.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "addToLife",
            target: {
              player: "self",
              zones: ["deck"],
              count: {
                amount: 1,
              },
            },
            position: "top",
          },
          {
            action: "rearrangeLife",
            player: "self",
            moveOneToDeckTop: true,
          },
        ],
      },
    ],
  },
  i18n: prb02EdwardNewgateSt13004PirateFoil004I18n,
};
