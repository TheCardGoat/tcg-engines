import type { CharacterCard } from "@tcg/op-types";
import { op16MonkeyDLuffy034I18n } from "./op16-034-monkey-d-luffy.i18n.ts";

export const op16MonkeyDLuffy034: CharacterCard = {
  id: "OP16-034",
  canonicalId: "OP16-034",
  slug: "monkey-d-luffy/op16-034",
  name: "Monkey.D.Luffy",
  printings: [
    {
      id: "OP16-034",
      artId: "OP16-034",
      setCode: "OP16",
      collectorNumber: "034",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP16-034_pi7IfhS.jpg",
      label: "Monkey.D.Luffy (034)",
    },
    {
      id: "OP16-034_p1",
      artId: "OP16-034_p1",
      setCode: "OP16",
      collectorNumber: "034",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP16-034_p1_rYPd1n8.jpg",
      label: "Monkey.D.Luffy (034) (Alternate Art)",
    },
  ],
  cardType: "character",
  color: ["green"],
  rarity: "R",
  setId: "OP16",
  cost: 1,
  power: 0,
  counter: 1000,
  attribute: "strike",
  traits: ["Straw Hat Crew Impel Down"],
  effect:
    "[DON!! x1] [Your Turn] This Character gains +1000 power for each of your Characters with a different card name.\n\n[On Play] Look at 3 cards from the top of your deck; reveal up to 1 {Impel Down} type card and add it to your hand. Then, place the rest at the bottom of your deck in any order.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "search",
            lookCount: 3,
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
                filter: "trait",
                value: "Impel Down",
                match: "includes",
              },
            ],
            revealDestination: "hand",
            remainderPosition: "bottom",
          },
        ],
      },
    ],
    permanentEffects: [
      {
        conditions: [
          {
            condition: "donAttached",
            amount: 1,
          },
          {
            condition: "turn",
            value: "your",
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
            value: 1000,
            valuePerDifferentNameOn: {
              player: "self",
              zones: ["character"],
              count: {
                amount: "all",
              },
            },
            duration: "permanent",
          },
        ],
      },
    ],
  },
  i18n: op16MonkeyDLuffy034I18n,
};
