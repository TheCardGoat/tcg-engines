import type { StageCard } from "@tcg/op-types";
import { op09Fullalead099I18n } from "./099-fullalead.i18n.ts";

export const op09Fullalead099: StageCard = {
  id: "OP09-099",
  cardType: "stage",
  color: ["black"],
  rarity: "C",
  setId: "OP09",
  cost: 1,
  traits: ["Blackbeard Pirates"],
  effect:
    '[Activate: Main] You may trash 1 card from your hand and rest this Stage: Look at 3 cards from the top of your deck; reveal up to 1 "Blackbeard Pirates" type card and add it to your hand. Then, place the rest at the bottom of your deck in any order.',
  effects: {
    effects: [
      {
        trigger: "activateMain",
        costs: [
          {
            cost: "trashFromHand",
            amount: 1,
          },
        ],
        actions: [
          {
            action: "search",
            lookCount: 3,
            source: {
              player: "self",
              zone: "deck",
            },
            revealCount: {
              amount: 1,
              upTo: true,
            },
            revealFilters: [
              {
                filter: "trait",
                value: "Blackbeard Pirates",
              },
            ],
            revealDestination: "hand",
            remainderPosition: "bottom",
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op09Fullalead099I18n,
};
