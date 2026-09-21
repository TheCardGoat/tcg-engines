import type { CharacterCard } from "@tcg/op-types";
import { op16Buggy031I18n } from "./op16-031-buggy.i18n.ts";

export const op16Buggy031: CharacterCard = {
  id: "OP16-031",
  canonicalId: "OP16-031",
  slug: "buggy/op16-031",
  name: "Buggy",
  printings: [
    {
      id: "OP16-031",
      artId: "OP16-031",
      setCode: "OP16",
      collectorNumber: "031",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP16-031_fF6LyTW.jpg",
      label: "Buggy (031)",
    },
  ],
  cardType: "character",
  color: ["green"],
  rarity: "UC",
  setId: "OP16",
  cost: 4,
  power: 5000,
  counter: 1000,
  traits: ["Buggy Pirates Impel Down"],
  attribute: "slash",
  effect: "[On K.O.] Play up to 1 [Prisoner of Impel Down] card from your hand.",
  effects: {
    effects: [
      {
        trigger: "onKo",
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
                value: "Prisoner of Impel Down",
              },
            ],
          },
        ],
      },
    ],
  },
  i18n: op16Buggy031I18n,
};
