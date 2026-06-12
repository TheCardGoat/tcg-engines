import type { CharacterCard } from "@tcg/lorcana-types";
import { kingCandyRoyalRacerI18n } from "./020-king-candy-royal-racer.i18n";

export const kingCandyRoyalRacer: CharacterCard = {
  id: "oc8",
  canonicalId: "ci_oc8",
  reprints: ["set7-020"],
  cardType: "character",
  name: "King Candy",
  version: "Royal Racer",
  inkType: ["amber", "ruby"],
  franchise: "Wreck It Ralph",
  set: "007",
  cardNumber: 20,
  rarity: "common",
  cost: 4,
  strength: 2,
  willpower: 2,
  lore: 2,
  inkable: false,
  externalIds: {
    lorcast: "crd_68c5e563c4774f3f94a16eed86475c95",
    tcgPlayer: 618737,
  },
  text: [
    {
      title: "SWEET REVENGE",
      description:
        "Whenever one of your other Racer characters is banished, each opponent chooses and banishes one of their characters.",
    },
  ],
  classifications: ["Storyborn", "Villain", "King", "Racer"],
  abilities: [
    {
      effect: {
        type: "for-each-opponent",
        effect: {
          type: "optional",
          chooser: "OPPONENT",
          effect: {
            type: "banish",
            target: {
              selector: "chosen",
              count: 1,
              owner: "opponent",
              zones: ["play"],
              cardTypes: ["character"],
            },
          },
        },
      },
      id: "oc8-1",
      name: "SWEET REVENGE",
      text: "SWEET REVENGE Whenever one of your other Racer characters is banished, each opponent chooses and banishes one of their characters.",
      trigger: {
        event: "banish",
        on: {
          controller: "you",
          cardType: "character",
          classification: "Racer",
          excludeSelf: true,
        },
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  i18n: kingCandyRoyalRacerI18n,
};
