import type { ItemCard } from "@tcg/lorcana-types";
import { mysticalInkcasterI18n } from "./066-mystical-inkcaster.i18n";

export const mysticalInkcaster: ItemCard = {
  id: "YMG",
  canonicalId: "ci_YMG",
  reprints: ["set11-066"],
  cardType: "item",
  name: "Mystical Inkcaster",
  inkType: ["amethyst"],
  franchise: "Lorcana",
  set: "011",
  cardNumber: 66,
  rarity: "rare",
  cost: 3,
  inkable: false,
  externalIds: {
    lorcast: "crd_3d8ed3e3edf846c7b5dc9cc034436b8e",
    tcgPlayer: 675301,
  },
  text: [
    {
      title: "SPECIAL SUMMONS",
      description:
        "{E}, 3 {I} — Play a character with cost 5 or less for free. They gain Rush. At the end of your turn, banish them. (They can challenge the turn they're played.)",
    },
  ],
  abilities: [
    {
      id: "1ah-1",
      name: "SPECIAL SUMMONS",
      type: "activated",
      cost: {
        exert: true,
        ink: 3,
      },
      effect: {
        type: "play-card",
        from: "hand",
        cardType: "character",
        cost: "free",
        filter: {
          maxCost: 5,
        },
        grantsRush: true,
        banishAtEndOfTurn: true,
      },
      text: "SPECIAL SUMMONS {E}, 3 {I} — Play a character with cost 5 or less for free. They gain Rush. At the end of your turn, banish them.",
    },
  ],
  i18n: mysticalInkcasterI18n,
};
