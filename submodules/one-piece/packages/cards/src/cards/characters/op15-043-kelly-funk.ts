import type { CharacterCard } from "@tcg/op-types";
import { op15KellyFunk043I18n } from "./op15-043-kelly-funk.i18n.ts";

export const op15KellyFunk043: CharacterCard = {
  id: "OP15-043",
  canonicalId: "OP15-043",
  slug: "kelly-funk/op15-043",
  name: "Kelly Funk",
  printings: [
    {
      id: "OP15-043",
      artId: "OP15-043",
      setCode: "OP15",
      collectorNumber: "043",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP15-043_OOqOx5V.jpg",
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
  effect: "[On Play] Play up to 1 [Bobby Funk] from your hand.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
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
                filter: "name",
                value: "Bobby Funk",
              },
            ],
          },
        ],
      },
    ],
  },
  i18n: op15KellyFunk043I18n,
};
