import type { ActionCard } from "@tcg/lorcana-types";
import { theGamesAfootI18n } from "./198-the-games-afoot.i18n";

export const theGamesAfoot: ActionCard = {
  id: "FDs",
  canonicalId: "ci_FDs",
  reprints: ["set10-198"],
  cardType: "action",
  name: "The Game's Afoot!",
  inkType: ["steel"],
  franchise: "Great Mouse Detective",
  set: "010",
  cardNumber: 198,
  rarity: "uncommon",
  cost: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_dcc0cd9b218f4392bcf503bf27701202",
    tcgPlayer: 660361,
  },
  text: "Move up to 2 of your characters to the same location for free. That location gains Resist +2 until the start of your next turn. (Damage dealt to it is reduced by 2.)",
  abilities: [
    {
      type: "action",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "move-to-location",
            cost: "free",
            character: {
              selector: "chosen",
              count: {
                upTo: 2,
              },
              owner: "you",
              zones: ["play"],
              cardTypes: ["character"],
            },
            location: {
              selector: "chosen",
              count: 1,
              owner: "you",
              zones: ["play"],
              cardTypes: ["location"],
            },
          },
          {
            type: "gain-keyword",
            keyword: "Resist",
            value: 2,
            duration: "until-start-of-next-turn",
            target: {
              selector: "chosen",
              count: 1,
              owner: "you",
              zones: ["play"],
              cardTypes: ["location"],
            },
          },
        ],
      },
    },
  ],
  i18n: theGamesAfootI18n,
};
