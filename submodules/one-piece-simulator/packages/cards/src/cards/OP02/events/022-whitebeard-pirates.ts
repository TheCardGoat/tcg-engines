import type { EventCard } from "@tcg/op-types";
import { op02WhitebeardPirates022I18n } from "./022-whitebeard-pirates.i18n.ts";

export const op02WhitebeardPirates022: EventCard = {
  id: "OP02-022",
  cardType: "event",
  color: ["red"],
  rarity: "UC",
  setId: "OP02",
  cost: 1,
  traits: ["Whitebeard Pirates"],
  effect:
    '[Main] Look at 5 cards from the top of your deck; reveal up to 1 Character card with a type including "Whitebeard Pirates" and add it to your hand. Then, place the rest at the bottom of your deck in any order. [Trigger] Activate this card\'s [Main] effect.',
  effects: {
    effects: [
      {
        trigger: "main",
        actions: [
          {
            action: "search",
            lookCount: 5,
            source: {
              player: "self",
              zone: "deck",
            },
            revealCount: {
              amount: 1,
              upTo: true,
            },
            revealDestination: "hand",
            remainderPosition: "bottom",
          },
        ],
      },
      {
        trigger: "trigger",
        actions: [
          {
            action: "activateEffect",
            effectTrigger: "main",
          },
        ],
      },
    ],
  },
  i18n: op02WhitebeardPirates022I18n,
};
