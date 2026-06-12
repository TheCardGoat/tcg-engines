import type { CharacterCard } from "@tcg/lorcana-types";
import { clarabelleContentedWallflowerI18n } from "./090-clarabelle-contented-wallflower.i18n";

export const clarabelleContentedWallflower: CharacterCard = {
  id: "gxZ",
  canonicalId: "ci_gxZ",
  reprints: ["set5-090"],
  cardType: "character",
  name: "Clarabelle",
  version: "Contented Wallflower",
  inkType: ["emerald"],
  set: "005",
  cardNumber: 90,
  rarity: "uncommon",
  cost: 3,
  strength: 2,
  willpower: 3,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_12fad68b6919451cb7165478fec5aee7",
    tcgPlayer: 559513,
  },
  text: [
    {
      title: "ONE STEP BEHIND",
      description:
        "When you play this character, if an opponent has more cards in their hand than you, you may draw a card.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
  abilities: [
    {
      condition: {
        type: "comparison",
        left: {
          type: "cards-in-hand",
          controller: "opponent",
        },
        comparison: "greater-than",
        right: {
          type: "cards-in-hand",
          controller: "you",
        },
      },
      effect: {
        chooser: "CONTROLLER",
        effect: {
          amount: 1,
          target: "CONTROLLER",
          type: "draw",
        },
        type: "optional",
      },
      id: "1v9-1",
      name: "ONE STEP BEHIND",
      text: "ONE STEP BEHIND When you play this character, if an opponent has more cards in their hand than you, you may draw a card.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  i18n: clarabelleContentedWallflowerI18n,
};
