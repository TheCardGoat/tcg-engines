import type { CharacterCard } from "@tcg/op-types";
import { op15BobbyFunk050I18n } from "./op15-050-bobby-funk.i18n.ts";

export const op15BobbyFunk050: CharacterCard = {
  id: "OP15-050",
  canonicalId: "OP15-050",
  slug: "bobby-funk/op15-050",
  name: "Bobby Funk",
  printings: [
    {
      id: "OP15-050",
      artId: "OP15-050",
      setCode: "OP15",
      collectorNumber: "050",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP15-050_vCtw6y1.jpg",
    },
  ],
  cardType: "character",
  color: ["blue"],
  rarity: "C",
  setId: "OP15",
  cost: 3,
  power: 3000,
  counter: 1000,
  traits: ["Dressrosa Mogaro Kingdom"],
  attribute: "strike",
  effect: "If you have [Kelly Funk], this Character gains +3000 power.",
  effects: {
    permanentEffects: [
      {
        conditions: [
          {
            condition: "hasCard",
            player: "self",
            zone: "field",
            filters: [
              {
                filter: "name",
                value: "Kelly Funk",
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
            value: 3000,
            duration: "permanent",
          },
        ],
      },
    ],
  },
  i18n: op15BobbyFunk050I18n,
};
