import type { CharacterCard } from "@tcg/lorcana-types";
import { mickeyMouseWaywardSorcererI18n } from "./051-mickey-mouse-wayward-sorcerer.i18n";

export const mickeyMouseWaywardSorcerer: CharacterCard = {
  id: "iGH",
  canonicalId: "ci_cZb",
  reprints: ["set1-051"],
  cardType: "character",
  name: "Mickey Mouse",
  version: "Wayward Sorcerer",
  inkType: ["amethyst"],
  set: "001",
  cardNumber: 51,
  rarity: "common",
  cost: 4,
  strength: 3,
  willpower: 4,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_5739e1f6076840cd901a1bc283ca6e96",
    tcgPlayer: 510154,
  },
  text: [
    {
      title: "ANIMATE BROOM",
      description: "You pay 1 {I} less to play Broom characters.",
    },
    {
      title: "CEASELESS WORKER",
      description:
        "Whenever one of your Broom characters is banished in a challenge, you may return that card to your hand.",
    },
  ],
  classifications: ["Dreamborn", "Sorcerer"],
  abilities: [
    {
      effect: {
        amount: 1,
        cardType: "character",
        classification: "Broom",
        type: "cost-reduction",
      },
      id: "kuw-1",
      name: "ANIMATE BROOM",
      text: "ANIMATE BROOM You pay 1 {I} less to play Broom characters.",
      type: "static",
    },
    {
      id: "kuw-2",
      name: "CEASELESS WORKER",
      type: "triggered",
      trigger: {
        event: "banish",
        on: {
          cardType: "character",
          classification: "Broom",
          controller: "you",
        },
        timing: "whenever",
        restrictions: [
          {
            type: "in-challenge",
          },
        ],
      },
      effect: {
        type: "optional",
        chooser: "CONTROLLER",
        effect: {
          type: "return-to-hand",
          target: {
            ref: "trigger-source",
          },
        },
      },
      text: "CEASELESS WORKER Whenever one of your Broom characters is banished in a challenge, you may return that card to your hand.",
    },
  ],
  i18n: mickeyMouseWaywardSorcererI18n,
};
