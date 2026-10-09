import type { CharacterCard } from "@tcg/op-types";
import { st20CharlotteCracker002I18n } from "./st20-002-charlotte-cracker.i18n.ts";
export const st20CharlotteCracker002: CharacterCard = {
  id: "ST20-002",
  canonicalId: "ST20-002",
  slug: "charlotte-cracker/st20-002",
  name: "Charlotte Cracker",
  printings: [
    {
      id: "ST20-002",
      artId: "ST20-002",
      setCode: "ST20",
      collectorNumber: "002",
      rarity: "C",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/ST20-002.png",
    },
  ],
  cardType: "character",
  color: ["yellow"],
  rarity: "C",
  setId: "ST20",
  cost: 4,
  power: 5000,
  counter: 1000,
  traits: ["Big Mom Pirates"],
  attribute: "slash",
  effect:
    "[Once Per Turn] If this Character would be K.O.'d by an effect, you may trash 1 card from the top of your Life cards instead.",
  trigger: "You may trash 1 card from your hand: Play this card.",
  effects: {
    effects: [
      {
        trigger: "trigger",
        costs: [
          {
            cost: "trashFromHand",
            amount: 1,
          },
        ],
        actions: [
          {
            action: "playThisCard",
          },
        ],
        optional: true,
      },
    ],
    replacementEffects: [
      {
        replacedEvent: "ko",
        source: "effect",
        eventFilter: {
          targetSelf: true,
        },
        replacementAction: {
          action: "removeFromLife",
          player: "self",
          count: {
            amount: 1,
          },
          destination: "trash",
        },
        oncePerTurn: true,
      },
    ],
  },
  i18n: st20CharlotteCracker002I18n,
};
