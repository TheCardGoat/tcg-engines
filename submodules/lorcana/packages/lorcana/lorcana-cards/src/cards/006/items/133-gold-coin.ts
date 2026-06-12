import type { ItemCard } from "@tcg/lorcana-types";
import { goldCoinI18n } from "./133-gold-coin.i18n";

export const goldCoin: ItemCard = {
  id: "5vQ",
  canonicalId: "ci_5vQ",
  reprints: ["set6-133"],
  cardType: "item",
  name: "Gold Coin",
  inkType: ["ruby"],
  franchise: "Wreck It Ralph",
  set: "006",
  cardNumber: 133,
  rarity: "common",
  cost: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_2543ac0748a945e3a4a68ef2f90e2feb",
    tcgPlayer: 591124,
  },
  text: [
    {
      title: "GLITTERING ACCESS",
      description:
        "{E}, 1 {I}, Banish this item — Ready chosen character of yours. They can't quest for the rest of this turn.",
    },
  ],
  abilities: [
    {
      cost: {
        exert: true,
        ink: 1,
        banishSelf: true,
      },
      effect: {
        type: "sequence",
        steps: [
          {
            type: "ready",
            target: "CHOSEN_CHARACTER_OF_YOURS",
          },
          {
            type: "restriction",
            restriction: "cant-quest",
            duration: "this-turn",
            target: {
              ref: "previous-target",
            },
          },
        ],
      },
      id: "1fl-1",
      name: "GLITTERING ACCESS",
      text: "GLITTERING ACCESS {E}, 1 {I}, Banish this item — Ready chosen character of yours. They can't quest for the rest of this turn.",
      type: "activated",
    },
  ],
  i18n: goldCoinI18n,
};
