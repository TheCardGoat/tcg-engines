import type { CharacterCard } from "@tcg/lorcana-types";
import { princeJohnGreediestOfAllI18n } from "./089-prince-john-greediest-of-all.i18n";
import { ward } from "../../../helpers/abilities/ward";

export const princeJohnGreediestOfAll: CharacterCard = {
  id: "Jlo",
  canonicalId: "ci_Jlo",
  reprints: ["set2-089"],
  cardType: "character",
  name: "Prince John",
  version: "Greediest of All",
  inkType: ["emerald"],
  franchise: "Robin Hood",
  set: "002",
  cardNumber: 89,
  rarity: "rare",
  cost: 3,
  strength: 1,
  willpower: 2,
  lore: 2,
  inkable: false,
  externalIds: {
    lorcast: "crd_f5e766865cfb44288cd71675cda91f7f",
    tcgPlayer: 522737,
  },
  text: [
    {
      title: "Ward",
    },
    {
      title: "I SENTENCE YOU",
      description:
        "Whenever your opponent discards 1 or more cards, you may draw a card for each card discarded.",
    },
  ],
  classifications: ["Dreamborn", "Villain", "Prince"],
  abilities: [
    ward,
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          amount: {
            type: "trigger-amount",
          },
          target: "CONTROLLER",
          type: "draw",
        },
        type: "optional",
      },
      id: "9so-2",
      name: "I SENTENCE YOU",
      text: "I SENTENCE YOU Whenever your opponent discards 1 or more cards, you may draw a card for each card discarded.",
      trigger: {
        event: "discard",
        on: "OPPONENT",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  i18n: princeJohnGreediestOfAllI18n,
};
