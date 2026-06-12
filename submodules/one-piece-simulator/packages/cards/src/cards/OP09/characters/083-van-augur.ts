import type { CharacterCard } from "@tcg/op-types";
import { op09VanAugur083I18n } from "./083-van-augur.i18n.ts";

export const op09VanAugur083: CharacterCard = {
  id: "OP09-083",
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
    '[Activate: Main] You may rest this Character: If your Leader has the "Blackbeard Pirates" type, give up to 1 of your opponent\'s Characters 3 cost during this turn.\n[On K.O.] Draw 1 card.',
  effects: {
    effects: [
      {
        trigger: "activateMain",
        conditions: [
          {
            condition: "leaderTrait",
            trait: "Blackbeard Pirates",
          },
        ],
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
            value: 3,
            duration: "thisTurn",
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
