import type { CharacterCard } from "@tcg/op-types";
import { op14eb04Killer005I18n } from "./005-killer.i18n.ts";

export const op14eb04Killer005: CharacterCard = {
  id: "OP14-005",
  canonicalId: "OP14-005",
  slug: "killer/op14-005",
  name: "Killer",
  printings: [
    {
      id: "OP14-005",
      artId: "OP14-005",
      setCode: "OP14EB04",
      collectorNumber: "005",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP14-005_01LijKG.jpg",
    },
  ],
  cardType: "character",
  color: ["red"],
  rarity: "C",
  setId: "OP14EB04",
  cost: 1,
  power: 1000,
  counter: 1000,
  traits: ["Kid Pirates Supernovas"],
  attribute: "slash",
  effect:
    "[Activate: Main] [Once Per Turn] Give up to 1 rested DON!! card to your Leader or 1 of your Characters.",
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
  i18n: op14eb04Killer005I18n,
};
