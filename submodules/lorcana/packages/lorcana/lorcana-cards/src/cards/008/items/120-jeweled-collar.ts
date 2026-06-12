import type { ItemCard } from "@tcg/lorcana-types";
import { jeweledCollarI18n } from "./120-jeweled-collar.i18n";

export const jeweledCollar: ItemCard = {
  id: "nJm",
  canonicalId: "ci_nJm",
  reprints: ["set8-120"],
  cardType: "item",
  name: "Jeweled Collar",
  inkType: ["emerald", "sapphire"],
  franchise: "Aristocats",
  set: "008",
  cardNumber: 120,
  rarity: "uncommon",
  cost: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_ee5ef7def0ca4c6a9ed3fac74fb1d1b4",
    tcgPlayer: 631764,
  },
  text: [
    {
      title: "WELCOME EXTRAVAGANCE",
      description:
        "Whenever one of your characters is challenged, you may put the top card of your deck into your inkwell facedown and exerted.",
    },
  ],
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          exerted: true,
          facedown: true,
          source: "top-of-deck",
          target: "CONTROLLER",
          type: "put-into-inkwell",
        },
        type: "optional",
      },
      id: "19v-1",
      name: "WELCOME EXTRAVAGANCE",
      text: "WELCOME EXTRAVAGANCE Whenever one of your characters is challenged, you may put the top card of your deck into your inkwell facedown and exerted.",
      trigger: {
        event: "challenged",
        on: {
          controller: "you",
          cardType: "character",
        },
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  i18n: jeweledCollarI18n,
};
