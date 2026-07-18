import type { CharacterCard } from "@tcg/op-types";
import { op14eb04Buffalo070I18n } from "./070-buffalo.i18n.ts";

export const op14eb04Buffalo070: CharacterCard = {
  id: "OP14-070",
  canonicalId: "OP14-070",
  slug: "buffalo/op14-070",
  name: "Buffalo",
  printings: [
    {
      id: "OP14-070",
      artId: "OP14-070",
      setCode: "OP14EB04",
      collectorNumber: "070",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP14-070_M1gfsnL.jpg",
    },
  ],
  cardType: "character",
  color: ["purple"],
  rarity: "C",
  setId: "OP14EB04",
  cost: 2,
  power: 1000,
  counter: 1000,
  traits: ["Donquixote Pirates"],
  attribute: "strike",
  effect:
    "When this Character becomes rested by your opponent's Character's effect, you may return 1 DON!! card from your field to your DON!! deck. If you do, set this Character as active.\n[Blocker]",
  effects: {
    keywords: ["blocker"],
    effects: [
      {
        trigger: "whenBecomesRested",
        eventFilter: { targetSelf: true },
        source: "opponentCharacterEffect",
        actions: [
          {
            action: "returnDon",
            player: "self",
            amount: 1,
            thenActions: [
              {
                action: "setActive",
                target: {
                  player: "self",
                  zones: ["character"],
                  count: {
                    amount: 1,
                  },
                  self: true,
                },
              },
            ],
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op14eb04Buffalo070I18n,
};
