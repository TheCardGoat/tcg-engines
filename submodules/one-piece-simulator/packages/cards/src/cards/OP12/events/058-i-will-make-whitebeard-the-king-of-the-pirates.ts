import type { EventCard } from "@tcg/op-types";
import { op12IWillMakeWhitebeardTheKingOfThePirates058I18n } from "./058-i-will-make-whitebeard-the-king-of-the-pirates.i18n.ts";

export const op12IWillMakeWhitebeardTheKingOfThePirates058: EventCard = {
  id: "OP12-058",
  cardType: "event",
  color: ["blue"],
  rarity: "C",
  setId: "OP12",
  cost: 9,
  trigger: "Draw 1 card.",
  traits: ["Whitebeard Pirates"],
  effect:
    '[Main] If your Leader\'s type includes "Whitebeard Pirates", reveal 1 card from the top of your deck. If that card is a Character card with a type including "Whitebeard Pirates" and a cost of 9 or less, you may play that card. If you do, that Character gains [Rush] during this turn.',
  effects: {
    effects: [
      {
        trigger: "main",
        conditions: [
          {
            condition: "leaderTrait",
            trait: "Whitebeard Pirates",
          },
        ],
        actions: [
          {
            action: "rearrangeDeck",
            player: "self",
            count: 1,
            position: "top",
          },
        ],
      },
    ],
  },
  i18n: op12IWillMakeWhitebeardTheKingOfThePirates058I18n,
};
