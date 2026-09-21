import type { LeaderCard } from "@tcg/op-types";
import { op15Brook022I18n } from "./op15-022-brook.i18n.ts";

export const op15Brook022: LeaderCard = {
  id: "OP15-022",
  canonicalId: "OP15-022",
  slug: "brook/op15-022",
  name: "Brook",
  printings: [
    {
      id: "OP15-022",
      artId: "OP15-022",
      setCode: "OP15",
      collectorNumber: "022",
      rarity: "L",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP15-022.jpg",
      label: "Brook (OP15-022)",
    },
    {
      id: "OP15-022_p1",
      artId: "OP15-022_p1",
      setCode: "OP15",
      collectorNumber: "022",
      rarity: "L",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP15-022_p1.jpg",
      label: "Brook (OP15-022) (Alternate Art)",
    },
  ],
  cardType: "leader",
  color: ["green", "black"],
  rarity: "L",
  setId: "OP15",
  power: 5000,
  life: 4,
  traits: ["Straw Hat Crew"],
  attribute: "slash",
  effect:
    "Under the rules of this game, you do not lose when your deck has 0 cards. You lose at the end of the turn in which your deck becomes 0 cards. [Activate: Main] [Once Per Turn] Trash 4 cards from the top of your deck. Then, if your deck has 0 cards, set up to 1 of your Characters as active.",
  effects: {
    effects: [
      {
        trigger: "activateMain",
        actions: [
          {
            action: "trashFromDeck",
            player: "self",
            amount: 4,
            thenActions: [
              {
                action: "conditional",
                predicate: {
                  condition: "zoneCount",
                  player: "self",
                  zone: "deck",
                  comparison: "eq",
                  value: 0,
                },
                whenTrue: [
                  {
                    action: "setActive",
                    target: {
                      player: "self",
                      zones: ["character"],
                      count: {
                        amount: 1,
                        upTo: true,
                      },
                    },
                  },
                ],
              },
            ],
          },
        ],
        oncePerTurn: true,
      },
    ],
    replacementEffects: [
      {
        replacedEvent: "loseGame",
        replacementAction: {
          action: "deferEmptyDeckLoss",
        },
        mandatory: true,
      },
    ],
  },
  i18n: op15Brook022I18n,
};
