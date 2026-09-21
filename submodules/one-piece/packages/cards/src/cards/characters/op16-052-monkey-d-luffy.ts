import type { CharacterCard } from "@tcg/op-types";
import { op16MonkeyDLuffy052I18n } from "./op16-052-monkey-d-luffy.i18n.ts";

export const op16MonkeyDLuffy052: CharacterCard = {
  id: "OP16-052",
  canonicalId: "OP16-052",
  slug: "monkey-d-luffy/op16-052",
  name: "Monkey.D.Luffy",
  printings: [
    {
      id: "OP16-052",
      artId: "OP16-052",
      setCode: "OP16",
      collectorNumber: "052",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP16-052_Rbt8BD0.jpg",
      label: "Monkey.D.Luffy (052)",
    },
  ],
  cardType: "character",
  color: ["blue"],
  rarity: "UC",
  setId: "OP16",
  cost: 2,
  power: 3000,
  counter: 1000,
  traits: ["Straw Hat Crew Impel Down"],
  attribute: "strike",
  effect:
    "[Activate:Main] [Once Per Turn] Give up to 1 rested DON!! card to your Leader or 1 of your Characters.",
  effects: {
    effects: [
      {
        trigger: "activateMain",
        actions: [
          {
            action: "giveDon",
            target: {
              player: "self",
              zones: ["leader", "character"],
              count: {
                amount: 1,
              },
            },
            count: {
              amount: 1,
              upTo: true,
            },
            donState: "rested",
          },
        ],
        oncePerTurn: true,
      },
    ],
  },
  i18n: op16MonkeyDLuffy052I18n,
};
