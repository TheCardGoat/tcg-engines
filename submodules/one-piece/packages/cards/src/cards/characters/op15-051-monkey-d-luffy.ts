import type { CharacterCard } from "@tcg/op-types";
import { op15MonkeyDLuffy051I18n } from "./op15-051-monkey-d-luffy.i18n.ts";

export const op15MonkeyDLuffy051: CharacterCard = {
  id: "OP15-051",
  canonicalId: "OP15-051",
  slug: "monkey-d-luffy/op15-051",
  name: "Monkey.D.Luffy",
  printings: [
    {
      id: "OP15-051",
      artId: "OP15-051",
      setCode: "OP15",
      collectorNumber: "051",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP15-051_PLRuTd8.jpg",
      label: "Monkey.D.Luffy (OP15-051)",
    },
  ],
  cardType: "character",
  color: ["blue"],
  rarity: "UC",
  setId: "OP15",
  cost: 3,
  power: 4000,
  counter: 2000,
  traits: ["Straw Hat Crew Dressrosa"],
  attribute: "strike",
  effect:
    '[Opponent\'s Turn] If your Leader has the "Dressrosa" type, this Character gains +3000 power.',
  effects: {
    permanentEffects: [
      {
        conditions: [
          {
            condition: "turn",
            value: "opponent",
          },
          {
            condition: "leaderTrait",
            trait: "Dressrosa",
            match: "includes",
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
            value: 3000,
            duration: "permanent",
          },
        ],
      },
    ],
  },
  i18n: op15MonkeyDLuffy051I18n,
};
