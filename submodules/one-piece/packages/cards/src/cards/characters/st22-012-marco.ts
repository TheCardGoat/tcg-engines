import type { CharacterCard } from "@tcg/op-types";
import { st22Marco012I18n } from "./st22-012-marco.i18n.ts";
export const st22Marco012: CharacterCard = {
  id: "ST22-012",
  canonicalId: "ST22-012",
  slug: "marco/st22-012",
  name: "Marco",
  printings: [
    {
      id: "ST22-012",
      artId: "ST22-012",
      setCode: "ST22",
      collectorNumber: "012",
      rarity: "C",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/ST22-012.png",
    },
  ],
  cardType: "character",
  color: ["blue"],
  rarity: "C",
  setId: "ST22",
  cost: 4,
  power: 5000,
  counter: 1000,
  traits: ["Whitebeard Pirates"],
  attribute: "special",
  effect:
    "[Once Per Turn] If this Character would be K.O.'d by your opponent's effect, you may trash 1 card from your hand instead. [When Attacking] Reveal 1 card from the top of your deck. If that card's type includes \"Whitebeard Pirates\", this Character gains +1000 power until the end of your opponent's next turn.",
  effects: {
    effects: [
      {
        trigger: "whenAttacking",
        actions: [
          {
            action: "revealFromDeck",
            player: "self",
            count: 1,
            ifRevealedCardMatches: {
              filters: [
                {
                  filter: "trait",
                  value: "Whitebeard Pirates",
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
                  value: 1000,
                  duration: "untilEndOfOpponentNextTurn",
                },
              ],
            },
          },
        ],
      },
    ],
    replacementEffects: [
      {
        replacedEvent: "ko",
        source: "opponentEffect",
        eventFilter: {
          targetSelf: true,
        },
        replacementAction: {
          action: "trashFromHand",
          player: "self",
          amount: 1,
        },
        oncePerTurn: true,
      },
    ],
  },
  i18n: st22Marco012I18n,
};
