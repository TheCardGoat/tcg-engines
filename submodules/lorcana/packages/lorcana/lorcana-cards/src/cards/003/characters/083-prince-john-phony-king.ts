import type { CharacterCard } from "@tcg/lorcana-types";
import { princeJohnPhonyKingI18n } from "./083-prince-john-phony-king.i18n";

export const princeJohnPhonyKing: CharacterCard = {
  id: "UGT",
  canonicalId: "ci_UGT",
  reprints: ["set3-083"],
  cardType: "character",
  name: "Prince John",
  version: "Phony King",
  inkType: ["emerald"],
  franchise: "Robin Hood",
  set: "003",
  cardNumber: 83,
  rarity: "uncommon",
  cost: 5,
  strength: 2,
  willpower: 4,
  lore: 2,
  inkable: false,
  externalIds: {
    lorcast: "crd_1af5228c0d75411ebc9eccf5cae1c086",
    tcgPlayer: 539081,
  },
  text: [
    {
      title: "COLLECT TAXES",
      description:
        "Whenever this character quests, each opponent with more lore than you loses 2 lore.",
    },
  ],
  classifications: ["Storyborn", "Villain", "Prince"],
  abilities: [
    {
      effect: {
        type: "for-each-opponent",
        condition: {
          type: "comparison",
          left: { type: "lore", controller: "opponent" },
          comparison: "greater",
          right: { type: "lore", controller: "you" },
        },
        effect: {
          type: "lose-lore",
          amount: 2,
          target: "OPPONENT",
        },
      },
      id: "m61-1",
      name: "COLLECT TAXES",
      text: "COLLECT TAXES Whenever this character quests, each opponent with more lore than you loses 2 lore.",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  i18n: princeJohnPhonyKingI18n,
};
