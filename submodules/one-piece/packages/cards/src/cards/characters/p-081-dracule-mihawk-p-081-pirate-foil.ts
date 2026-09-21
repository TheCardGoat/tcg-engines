import type { CharacterCard } from "@tcg/op-types";
import { prb02DraculeMihawkP081PirateFoil081I18n } from "./p-081-dracule-mihawk-p-081-pirate-foil.i18n.ts";

export const prb02DraculeMihawkP081PirateFoil081: CharacterCard = {
  id: "P-081",
  canonicalId: "P-081",
  slug: "dracule-mihawk-p-081-pirate-foil",
  name: "Dracule Mihawk",
  printings: [
    {
      id: "P-081",
      artId: "P-081",
      setCode: "P",
      collectorNumber: "081",
      rarity: "P",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/P-081_p2.jpg",
      label: "Dracule Mihawk - P-081 (Pirate Foil)",
    },
    {
      id: "P-081_r1",
      artId: "P-081_r1",
      setCode: "P",
      collectorNumber: "081",
      rarity: "P",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/P-081_r1.jpg",
      label: "Dracule Mihawk - P-081 (Reprint)",
    },
  ],
  cardType: "character",
  color: ["blue"],
  rarity: "P",
  setId: "P",
  cost: 4,
  power: 5000,
  counter: 1000,
  traits: ["Cross Guild"],
  attribute: "slash",
  effect:
    '[Activate:Main] You may return this Character to the owner\'s hand: If you have 3 or more blue "Cross Guild" type Characters, play up to 1 "Cross Guild" type Character card with a cost of 5 from your hand.',
  effects: {
    effects: [
      {
        trigger: "activateMain",
        costs: [
          {
            cost: "returnThisToHand",
          },
        ],
        actions: [
          {
            action: "play",
            source: {
              player: "self",
              zone: "hand",
            },
            count: {
              amount: 1,
              upTo: true,
            },
            filters: [
              {
                filter: "cost",
                comparison: "eq",
                value: 5,
              },
              {
                filter: "trait",
                value: "Cross Guild",
                match: "includes",
              },
              {
                filter: "cardCategory",
                value: "character",
              },
            ],
            condition: {
              condition: "zoneCount",
              player: "self",
              zone: "character",
              comparison: "gte",
              value: 3,
              filters: [
                {
                  filter: "color",
                  value: "blue",
                },
                {
                  filter: "trait",
                  value: "Cross Guild",
                  match: "includes",
                },
              ],
            },
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: prb02DraculeMihawkP081PirateFoil081I18n,
};
