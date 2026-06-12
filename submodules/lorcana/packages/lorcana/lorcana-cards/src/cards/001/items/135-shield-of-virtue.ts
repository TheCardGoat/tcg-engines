import type { ItemCard } from "@tcg/lorcana-types";
import { shieldOfVirtueI18n } from "./135-shield-of-virtue.i18n";

export const shieldOfVirtue: ItemCard = {
  id: "lec",
  canonicalId: "ci_lec",
  reprints: ["set1-135"],
  cardType: "item",
  name: "Shield of Virtue",
  inkType: ["ruby"],
  franchise: "Sleeping Beauty",
  set: "001",
  cardNumber: 135,
  rarity: "uncommon",
  cost: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_81867e9c25c44f33aa150e70b57bb4dd",
    tcgPlayer: 508789,
  },
  text: [
    {
      title: "FIREPROOF",
      description:
        "{E}, 3 {I} — Ready chosen character. They can't quest for the rest of this turn.",
    },
  ],
  abilities: [
    {
      cost: {
        exert: true,
        ink: 3,
      },
      effect: {
        steps: [
          {
            target: "CHOSEN_CHARACTER",
            type: "ready",
          },
          {
            duration: "this-turn",
            restriction: "cant-quest",
            target: {
              ref: "previous-target",
            },
            type: "restriction",
          },
        ],
        type: "sequence",
      },
      id: "f35-1",
      name: "FIREPROOF",
      text: "FIREPROOF {E}, 3 {I} — Ready chosen character. They can't quest for the rest of this turn.",
      type: "activated",
    },
  ],
  i18n: shieldOfVirtueI18n,
};
