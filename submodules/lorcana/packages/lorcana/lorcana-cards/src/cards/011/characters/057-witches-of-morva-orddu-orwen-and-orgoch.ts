import type { CharacterCard } from "@tcg/lorcana-types";
import { witchesOfMorvaOrdduOrwenAndOrgochI18n } from "./057-witches-of-morva-orddu-orwen-and-orgoch.i18n";

export const witchesOfMorvaOrdduOrwenAndOrgoch: CharacterCard = {
  id: "JTw",
  canonicalId: "ci_JTw",
  reprints: ["set11-057"],
  cardType: "character",
  name: "Witches of Morva",
  version: "Orddu, Orwen, and Orgoch",
  inkType: ["amethyst"],
  franchise: "Black Cauldron",
  set: "011",
  cardNumber: 57,
  rarity: "rare",
  cost: 5,
  strength: 4,
  willpower: 4,
  lore: 2,
  inkable: false,
  externalIds: {
    lorcast: "crd_5c24d2a781524b8fa28b72a0dddd91c5",
    tcgPlayer: 675295,
  },
  text: [
    {
      title: "QUITE A BARGAIN",
      description:
        "When you play this character, you may return another chosen character of yours to your hand. If you do, gain 1 lore.",
    },
  ],
  classifications: ["Storyborn", "Villain", "Sorcerer"],
  abilities: [
    {
      id: "11p-1",
      effect: {
        steps: [
          {
            chooser: "CONTROLLER",
            effect: {
              steps: [
                {
                  target: {
                    cardTypes: ["character"],
                    count: 1,
                    excludeSelf: true,
                    owner: "you",
                    selector: "chosen",
                    zones: ["play"],
                  },
                  type: "return-to-hand",
                },
                {
                  condition: {
                    type: "if-you-do",
                  },
                  then: {
                    amount: 1,
                    type: "gain-lore",
                  },
                  type: "conditional",
                },
              ],
              type: "sequence",
            },
            type: "optional",
          },
        ],
        type: "sequence",
      },
      name: "QUITE A BARGAIN",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
      text: "QUITE A BARGAIN When you play this character, you may return another chosen character of yours to your hand. If you do, gain 1 lore.",
    },
  ],
  i18n: witchesOfMorvaOrdduOrwenAndOrgochI18n,
};
