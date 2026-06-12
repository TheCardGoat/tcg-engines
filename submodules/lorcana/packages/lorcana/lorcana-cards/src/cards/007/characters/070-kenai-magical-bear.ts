import type { CharacterCard } from "@tcg/lorcana-types";
import { kenaiMagicalBearI18n } from "./070-kenai-magical-bear.i18n";
import { challenger } from "../../../helpers/abilities/challenger";

export const kenaiMagicalBear: CharacterCard = {
  id: "7zp",
  canonicalId: "ci_7zp",
  reprints: ["set7-070"],
  cardType: "character",
  name: "Kenai",
  version: "Magical Bear",
  inkType: ["amethyst"],
  franchise: "Brother Bear",
  set: "007",
  cardNumber: 70,
  rarity: "rare",
  cost: 3,
  strength: 1,
  willpower: 4,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_b9ef052585ff4d9db2b101a61b3b9486",
    tcgPlayer: 618326,
  },
  text: [
    {
      title: "Challenger +2",
    },
    {
      title: "WISDOM OF HIS STORY",
      description:
        "During your turn, when this character is banished in a challenge, return this card to your hand and gain 1 lore.",
    },
  ],
  classifications: ["Storyborn", "Hero"],
  abilities: [
    challenger(2),
    {
      effect: {
        steps: [
          {
            target: {
              ref: "self",
            },
            type: "return-to-hand",
          },
          {
            amount: 1,
            target: "CONTROLLER",
            type: "gain-lore",
          },
        ],
        type: "sequence",
      },
      id: "wwk-2",
      name: "WISDOM OF HIS STORY",
      sourceZones: ["play", "discard"],
      text: "WISDOM OF HIS STORY During your turn, when this character is banished in a challenge, return this card to your hand and gain 1 lore.",
      trigger: {
        event: "banish",
        on: "SELF",
        restrictions: [
          {
            type: "in-challenge",
          },
          {
            type: "during-turn",
            whose: "your",
          },
        ],
        timing: "when",
      },
      type: "triggered",
    },
  ],
  i18n: kenaiMagicalBearI18n,
};
