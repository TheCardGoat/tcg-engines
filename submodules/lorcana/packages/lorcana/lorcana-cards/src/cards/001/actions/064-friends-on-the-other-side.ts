import type { ActionCard } from "@tcg/lorcana-types";
import { friendsOnTheOtherSideI18n } from "./064-friends-on-the-other-side.i18n";

export const friendsOnTheOtherSide: ActionCard = {
  id: "3E2",
  canonicalId: "ci_3E2",
  reprints: ["set1-064"],
  cardType: "action",
  name: "Friends on the Other Side",
  inkType: ["amethyst"],
  franchise: "Princess and the Frog",
  set: "001",
  cardNumber: 64,
  rarity: "common",
  cost: 3,
  inkable: true,
  externalIds: {
    lorcast: "crd_f9097c53f99d488aa8685b73ea5a9373",
    tcgPlayer: 494100,
  },
  text: "Draw 2 cards.",
  actionSubtype: "song",
  abilities: [
    {
      type: "action",
      effect: {
        amount: 2,
        target: "CONTROLLER",
        type: "draw",
      },
    },
  ],
  i18n: friendsOnTheOtherSideI18n,
};
