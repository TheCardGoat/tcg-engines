import type { CharacterCard } from "@tcg/op-types";
import { st27SanjuanWolf004I18n } from "./st27-004-sanjuan-wolf.i18n.ts";
export const st27SanjuanWolf004: CharacterCard = {
  id: "ST27-004",
  canonicalId: "ST27-004",
  slug: "sanjuan-wolf/st27-004",
  name: "Sanjuan.Wolf",
  printings: [
    {
      id: "ST27-004",
      artId: "ST27-004",
      setCode: "ST27",
      collectorNumber: "004",
      rarity: "C",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/ST27-004.png",
    },
  ],
  cardType: "character",
  color: ["black"],
  rarity: "C",
  setId: "ST27",
  cost: 4,
  traits: ["Giant", "Blackbeard Pirates"],
  power: 6000,
  attribute: "strike",
  counter: 1000,
  effect:
    "If your Leader has the {Blackbeard Pirates} type, this Character gains [Blocker] and +1 cost for every 4 cards in your trash. (After your opponent declares an attack, you may rest this card to make it the new target of the attack.) [On Play] Trash 1 card from your hand.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "trashFromHand",
            player: "self",
            amount: 1,
          },
        ],
      },
    ],
    permanentEffects: [
      {
        conditions: [
          {
            condition: "leaderTrait",
            trait: "Blackbeard Pirates",
            match: "exact",
          },
        ],
        actions: [
          {
            action: "grantKeyword",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
              },
              self: true,
            },
            keyword: "blocker",
            duration: "permanent",
          },
          {
            action: "modifyCost",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
              },
              self: true,
            },
            value: 1,
            valuePerCardGroup: {
              size: 4,
              target: {
                player: "self",
                zones: ["trash"],
                count: {
                  amount: "all",
                },
              },
            },
            duration: "permanent",
          },
        ],
      },
    ],
  },
  i18n: st27SanjuanWolf004I18n,
};
