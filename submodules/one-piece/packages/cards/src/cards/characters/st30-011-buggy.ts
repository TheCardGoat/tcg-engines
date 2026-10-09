import type { CharacterCard } from "@tcg/op-types";
import { st30Buggy011I18n } from "./st30-011-buggy.i18n.ts";
export const st30Buggy011: CharacterCard = {
  id: "ST30-011",
  canonicalId: "ST30-011",
  slug: "buggy/st30-011",
  name: "Buggy",
  printings: [
    {
      id: "ST30-011",
      artId: "ST30-011",
      setCode: "ST30",
      collectorNumber: "011",
      rarity: "C",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/ST30-011.png",
    },
  ],
  cardType: "character",
  color: ["green"],
  rarity: "C",
  setId: "ST30",
  cost: 2,
  traits: ["Impel Down", "Buggy Pirates"],
  power: 1000,
  attribute: "slash",
  counter: 1000,
  effect:
    "If your Character with 6000 base power would be removed from the field by your opponent's effect, you may rest this Character instead. [Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.)",
  effects: {
    keywords: ["blocker"],
    replacementEffects: [
      {
        replacedEvent: "removeFromField",
        target: {
          player: "self",
          zones: ["character"],
          count: {
            amount: 1,
          },
          filters: [
            {
              filter: "basePower",
              comparison: "eq",
              value: 6000,
            },
          ],
        },
        source: "opponentEffect",
        replacementAction: {
          action: "rest",
          target: {
            player: "self",
            zones: ["character"],
            count: {
              amount: 1,
            },
            self: true,
          },
        },
      },
    ],
  },
  i18n: st30Buggy011I18n,
};
