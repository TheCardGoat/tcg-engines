import type { CharacterCard } from "@tcg/op-types";
import { op16PortgasDAce118I18n } from "./op16-118-portgas-d-ace.i18n.ts";

export const op16PortgasDAce118: CharacterCard = {
  id: "OP16-118",
  canonicalId: "OP16-118",
  slug: "portgas-d-ace/op16-118",
  name: "Portgas.D.Ace",
  printings: [
    {
      id: "OP16-118",
      artId: "OP16-118",
      setCode: "OP16",
      collectorNumber: "118",
      rarity: "SEC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP16-118_X6FmLLp.jpg",
      label: "Portgas.D.Ace (118)",
    },
    {
      id: "OP16-118_p1",
      artId: "OP16-118_p1",
      setCode: "OP16",
      collectorNumber: "118",
      rarity: "SEC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP16-118_p1_zKFreVA.jpg",
      label: "Portgas.D.Ace (118) (Alternate Art)",
    },
  ],
  cardType: "character",
  color: ["red"],
  rarity: "SEC",
  setId: "OP16",
  cost: 5,
  power: 6000,
  counter: 1000,
  traits: ["Whitebeard Pirates"],
  attribute: "special",
  effect:
    'The counter of all of your Character cards with 8000 power in your hand becomes +2000.\n[On Play]/[On K.O.] Look at 5 cards from the top of your deck; reveal up to 1 [Monkey.D.Luffy] or up to 1 card with a type including "Whitebeard Pirates" and add it to your hand. Then, place the rest a the bottom of your deck in any order.',
  effects: {
    permanentEffects: [
      {
        conditions: [],
        actions: [
          {
            action: "modifyCounter",
            target: {
              player: "self",
              zones: ["hand"],
              count: {
                amount: "all",
              },
              filters: [
                {
                  filter: "power",
                  comparison: "eq",
                  value: 8000,
                },
              ],
            },
            value: 2000,
            duration: "permanent",
          },
        ],
      },
    ],

    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "search",
            lookCount: 5,
            source: {
              player: "self",
              zone: "deck",
            },
            revealCount: {
              amount: 1,
              upTo: true,
            },
            revealFilters: [
              {
                filter: "anyOf",
                filters: [
                  {
                    filter: "name",
                    value: "Monkey.D.Luffy",
                  },
                  {
                    filter: "trait",
                    value: "Whitebeard Pirates",
                    match: "includes",
                  },
                ],
              },
            ],
            revealDestination: "hand",
            remainderPosition: "bottom",
          },
        ],
      },
      {
        trigger: "onKo",
        actions: [
          {
            action: "search",
            lookCount: 5,
            source: {
              player: "self",
              zone: "deck",
            },
            revealCount: {
              amount: 1,
              upTo: true,
            },
            revealFilters: [
              {
                filter: "anyOf",
                filters: [
                  {
                    filter: "name",
                    value: "Monkey.D.Luffy",
                  },
                  {
                    filter: "trait",
                    value: "Whitebeard Pirates",
                    match: "includes",
                  },
                ],
              },
            ],
            revealDestination: "hand",
            remainderPosition: "bottom",
          },
        ],
      },
    ],
  },
  i18n: op16PortgasDAce118I18n,
};
