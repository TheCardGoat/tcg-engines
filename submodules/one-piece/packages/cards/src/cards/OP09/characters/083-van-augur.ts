import type { CharacterCard } from "@tcg/op-types";
import { op09VanAugur083I18n } from "./083-van-augur.i18n.ts";

export const op09VanAugur083: CharacterCard = {
  id: "OP09-083",
  canonicalId: "OP09-083",
  slug: "van-augur",
  name: "Van Augur",
  printings: [
    {
      id: "OP09-083",
      artId: "OP09-083",
      setCode: "OP09",
      collectorNumber: "083",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP09-083.jpg",
    },
  ],
  cardType: "character",
  color: ["black"],
  rarity: "R",
  setId: "OP09",
  cost: 5,
  power: 6000,
  counter: 1000,
  traits: ["Blackbeard Pirates"],
  attribute: "ranged",
  effect:
    '[Activate: Main] You may rest this Character: If your Leader has the "Blackbeard Pirates" type, give up to 1 of your opponent\'s Characters −3 cost during this turn.\n[On K.O.] Draw 1 card.',
  effects: {
    effects: [
      {
        trigger: "activateMain",
        costs: [
          {
            cost: "restThisCard",
          },
        ],
        actions: [
          {
            action: "modifyCost",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            value: -3,
            duration: "thisTurn",
            condition: {
              condition: "leaderTrait",
              trait: "Blackbeard Pirates",
              match: "includes",
            },
          },
        ],
        optional: true,
      },
      {
        trigger: "onKo",
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 1,
          },
        ],
      },
    ],
  },
  i18n: op09VanAugur083I18n,
};
