import type { ItemCard } from "@tcg/lorcana-types";
import { naveensUkuleleI18n } from "./031-naveens-ukulele.i18n";

export const naveensUkulele: ItemCard = {
  id: "2CJ",
  canonicalId: "ci_2CJ",
  reprints: ["set6-031"],
  cardType: "item",
  name: "Naveen's Ukulele",
  inkType: ["amber"],
  franchise: "Princess and the Frog",
  set: "006",
  cardNumber: 31,
  rarity: "common",
  cost: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_d4d40d9e539442f592da01b640e440a7",
    tcgPlayer: 593032,
  },
  text: [
    {
      title: "MAKE IT SING 1",
      description:
        "{I}, Banish this item — Chosen character counts as having +3 cost to sing songs this turn.",
    },
  ],
  abilities: [
    {
      cost: {
        ink: 1,
        banishSelf: true,
      },
      effect: {
        type: "modify-stat",
        stat: "singer-threshold",
        modifier: 3,
        duration: "this-turn",
        target: "CHOSEN_CHARACTER",
      },
      id: "2CJ-1",
      name: "MAKE IT SING 1",
      text: "MAKE IT SING 1 {I}, Banish this item — Chosen character counts as having +3 cost to sing songs this turn.",
      type: "activated",
    },
  ],
  i18n: naveensUkuleleI18n,
};
