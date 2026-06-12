import type { CharacterCard } from "@tcg/op-types";
import { eb03NicoRobin055I18n } from "./055-nico-robin.i18n.ts";

export const eb03NicoRobin055: CharacterCard = {
  id: "EB03-055",
  cardType: "character",
  color: ["yellow"],
  rarity: "SR",
  setId: "EB03",
  cost: 7,
  power: 8000,
  traits: ["Straw Hat Crew"],
  attribute: "strike",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB03-055_p2_GwiCq60.jpg",
      imageId: "EB03-055_p2",
    },
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB03-055_p1_yXhWcpK.jpg",
      imageId: "EB03-055_p1",
    },
  ],
  effect:
    "[On Play] You may trash 1 card from the top of your Life cards: If your Leader has the {Straw Hat Crew} type, add up to 2 cards from the top of your deck to the top of your Life cards.\n[Opponent's Turn] [On K.O.] You may deal 1 damage to your opponent.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "leaderTrait",
            trait: "Straw Hat Crew",
          },
        ],
        actions: [
          {
            action: "addToLife",
            target: {
              player: "self",
              zones: ["deck"],
              count: {
                amount: 2,
                upTo: true,
              },
            },
            position: "top",
          },
        ],
        optional: true,
      },
      {
        trigger: "onKo",
        conditions: [
          {
            condition: "turn",
            value: "opponent",
          },
        ],
        actions: [
          {
            action: "dealDamage",
            player: "opponent",
            amount: 1,
          },
        ],
      },
    ],
  },
  i18n: eb03NicoRobin055I18n,
};
