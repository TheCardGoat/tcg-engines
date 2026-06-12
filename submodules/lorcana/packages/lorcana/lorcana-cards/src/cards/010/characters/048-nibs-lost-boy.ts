import type { CharacterCard } from "@tcg/lorcana-types";
import { nibsLostBoyI18n } from "./048-nibs-lost-boy.i18n";

export const nibsLostBoy: CharacterCard = {
  id: "Jxb",
  canonicalId: "ci_Jxb",
  reprints: ["set10-048"],
  cardType: "character",
  name: "Nibs",
  version: "Lost Boy",
  inkType: ["amethyst"],
  franchise: "Peter Pan",
  set: "010",
  cardNumber: 48,
  rarity: "uncommon",
  cost: 4,
  strength: 3,
  willpower: 3,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_c7e80f6c5dbe488380403f55cd22784a",
    tcgPlayer: 658335,
  },
  text: [
    {
      title: "LOOK WHO'S BACK",
      description: "When this character is banished in a challenge, return this card to your hand.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
  abilities: [
    {
      id: "1ar-1",
      name: "LOOK WHO'S BACK",
      text: "LOOK WHO'S BACK When this character is banished in a challenge, return this card to your hand.",
      type: "triggered",
      sourceZones: ["play", "discard"],
      trigger: {
        event: "banish",
        on: "SELF",
        restrictions: [
          {
            type: "in-challenge",
          },
        ],
        timing: "when",
      },
      effect: {
        target: {
          ref: "self",
        },
        type: "return-to-hand",
      },
    },
  ],
  i18n: nibsLostBoyI18n,
};
