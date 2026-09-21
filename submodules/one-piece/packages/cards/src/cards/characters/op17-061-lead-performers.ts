import type { CharacterCard } from "@tcg/op-types";
import { op17LeadPerformers061I18n } from "./op17-061-lead-performers.i18n.ts";

export const op17LeadPerformers061: CharacterCard = {
  id: "OP17-061",
  canonicalId: "OP17-061",
  slug: "lead-performers/op17-061",
  name: "Lead Performers",
  printings: [
    {
      id: "OP17-061",
      artId: "OP17-061",
      setCode: "OP17",
      collectorNumber: "061",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP17-061_Q2ZEs5m.jpg",
    },
    {
      id: "OP17-061_p1",
      artId: "OP17-061_p1",
      setCode: "OP17",
      collectorNumber: "061",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP17-061_p1_Hi18tjj.jpg",
      label: "Lead Performers (Alternate Art)",
    },
  ],
  cardType: "character",
  color: ["purple"],
  rarity: "R",
  setId: "OP17",
  cost: 9,
  power: 11000,
  traits: ["Fish-Man Animal Kingdom Pirates"],
  attribute: ["strike", "special"],
  effect:
    "[On Play] DON!! 1: If your Leader has the {Animal Kingdom Pirates} type, add up to 1 card from the top of your deck to the top of your Life cards.\n[Activate: Main] You may trash this Character: Play up to 1 [King], [Queen], or [Jack] from your hand.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        costs: [
          {
            cost: "returnDon",
            amount: 1,
          },
        ],
        actions: [
          {
            action: "addToLife",
            target: {
              player: "self",
              zones: ["deck"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            position: "top",
            condition: {
              condition: "leaderTrait",
              trait: "Animal Kingdom Pirates",
              match: "includes",
            },
          },
        ],
        optional: true,
      },
      {
        trigger: "activateMain",
        costs: [
          {
            cost: "trashThisCard",
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
                filter: "anyOf",
                filters: [
                  {
                    filter: "name",
                    value: "King",
                  },
                  {
                    filter: "name",
                    value: "Queen",
                  },
                  {
                    filter: "name",
                    value: "Jack",
                  },
                ],
              },
            ],
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op17LeadPerformers061I18n,
};
