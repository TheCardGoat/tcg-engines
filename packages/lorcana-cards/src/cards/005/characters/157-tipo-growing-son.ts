import type { CharacterCard } from "@tcg/lorcana-types";

export const tipoGrowingSon: CharacterCard = {
  id: "1wt",
  cardType: "character",
  name: "Tipo",
  version: "Growing Son",
  fullName: "Tipo - Growing Son",
  inkType: ["sapphire"],
  franchise: "Emperors New Groove",
  set: "005",
  text: "MEASURE ME AGAIN When you play this character, you may put a card from your hand into your inkwell facedown and exerted.",
  cost: 2,
  strength: 1,
  willpower: 2,
  lore: 1,
  cardNumber: 157,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "f80eee1a0d8f58f63e04f6f9578c9d603326d912",
  },
  abilities: [
    {
      id: "1wt-1",
      type: "triggered",
      name: "MEASURE ME AGAIN",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "optional",
        effect: {
          type: "put-into-inkwell",
          source: "hand",
          target: "CONTROLLER",
          exerted: true,
          facedown: true,
        },
        chooser: "CONTROLLER",
      },
      text: "MEASURE ME AGAIN When you play this character, you may put a card from your hand into your inkwell facedown and exerted.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
};
