import type { CharacterCard } from "@tcg/op-types";
import { st27AvaloPizarro001I18n } from "./st27-001-avalo-pizarro.i18n.ts";
export const st27AvaloPizarro001: CharacterCard = {
  id: "ST27-001",
  canonicalId: "ST27-001",
  slug: "avalo-pizarro/st27-001",
  name: "Avalo Pizarro",
  printings: [
    {
      id: "ST27-001",
      artId: "ST27-001",
      setCode: "ST27",
      collectorNumber: "001",
      rarity: "C",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/ST27-001.png",
    },
  ],
  cardType: "character",
  color: ["black"],
  rarity: "C",
  setId: "ST27",
  cost: 1,
  traits: ["Blackbeard Pirates"],
  power: 1000,
  attribute: "special",
  counter: 1000,
  effect:
    "[Activate: Main] [Once Per Turn] You may rest 1 of your [Fullalead] cards: If your Leader has the {Blackbeard Pirates} type, this Character gains +4000 power during this turn. [On K.O.] Draw 1 card.",
  effects: {
    effects: [
      {
        trigger: "activateMain",
        costs: [
          {
            cost: "restCards",
            amount: 1,
            filters: [
              {
                filter: "name",
                value: "Fullalead",
              },
            ],
          },
        ],
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
              },
              self: true,
            },
            value: 4000,
            duration: "thisTurn",
            condition: {
              condition: "leaderTrait",
              trait: "Blackbeard Pirates",
              match: "exact",
            },
          },
        ],
        optional: true,
        oncePerTurn: true,
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
  i18n: st27AvaloPizarro001I18n,
};
