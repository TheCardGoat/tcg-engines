import type { CharacterCard } from "@tcg/op-types";
import { st22KouzukiOden005I18n } from "./st22-005-kouzuki-oden.i18n.ts";
export const st22KouzukiOden005: CharacterCard = {
  id: "ST22-005",
  canonicalId: "ST22-005",
  slug: "kouzuki-oden/st22-005",
  name: "Kouzuki Oden",
  printings: [
    {
      id: "ST22-005",
      artId: "ST22-005",
      setCode: "ST22",
      collectorNumber: "005",
      rarity: "SR",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/ST22-005.png",
    },
  ],
  cardType: "character",
  color: ["blue"],
  rarity: "SR",
  setId: "ST22",
  cost: 7,
  power: 8000,
  traits: ["Land of Wano", "Kouzuki Clan", "Whitebeard Pirates"],
  attribute: "slash",
  effect:
    "If this Character would be removed from the field by your opponent's effect, you may trash 2 cards from your hand instead. [Activate: Main] [Once Per Turn] You may rest 3 of your DON!! cards and return 1 of your Characters other than this Character to the owner's hand: Set this Character as active.",
  effects: {
    effects: [
      {
        trigger: "activateMain",
        costs: [
          {
            cost: "restDon",
            amount: 3,
          },
          {
            cost: "returnCharacter",
            amount: 1,
            filters: [
              {
                filter: "excludeSelf",
              },
            ],
          },
        ],
        actions: [
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
        optional: true,
        oncePerTurn: true,
      },
    ],
    replacementEffects: [
      {
        replacedEvent: "removeFromField",
        source: "opponentEffect",
        eventFilter: {
          targetSelf: true,
        },
        replacementAction: {
          action: "trashFromHand",
          player: "self",
          amount: 2,
        },
      },
    ],
  },
  i18n: st22KouzukiOden005I18n,
};
