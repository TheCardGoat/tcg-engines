import type { CharacterCard } from "@tcg/lorcana-types";
import { ladyTremaineBitterlyJealousI18n } from "./115-lady-tremaine-bitterly-jealous.i18n";

export const ladyTremaineBitterlyJealous: CharacterCard = {
  id: "KTu",
  canonicalId: "ci_KTu",
  reprints: ["set7-115"],
  cardType: "character",
  name: "Lady Tremaine",
  version: "Bitterly Jealous",
  inkType: ["emerald"],
  franchise: "Cinderella",
  set: "007",
  cardNumber: 115,
  rarity: "legendary",
  cost: 6,
  strength: 3,
  willpower: 3,
  lore: 2,
  inkable: false,
  externalIds: {
    lorcast: "crd_9cb99a5eecf64cd9a96cbc780861205c",
    tcgPlayer: 619469,
  },
  text: [
    {
      title: "THAT'S QUITE ENOUGH",
      description:
        "{E} — Return chosen damaged character to their player's hand. Then, each opponent discards a card at random.",
    },
  ],
  classifications: ["Storyborn", "Villain"],
  abilities: [
    {
      cost: {
        exert: true,
      },
      effect: {
        type: "sequence",
        steps: [
          {
            type: "return-to-hand",
            target: {
              cardTypes: ["character"],
              count: 1,
              filter: [
                {
                  type: "damaged",
                },
              ],
              owner: "any",
              selector: "chosen",
              zones: ["play"],
            },
          },
          {
            type: "discard",
            amount: 1,
            random: true,
            target: "EACH_OPPONENT",
          },
        ],
      },
      id: "1n1-1",
      name: "THAT'S QUITE ENOUGH",
      text: "THAT'S QUITE ENOUGH {E} — Return chosen damaged character to their player's hand. Then, each opponent discards a card at random.",
      type: "activated",
    },
  ],
  i18n: ladyTremaineBitterlyJealousI18n,
};
