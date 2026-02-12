import type { CharacterCard } from "@tcg/lorcana-types";

export const tipoGrowingSon: CharacterCard = {
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          exerted: true,
          facedown: true,
          source: "hand",
          target: "CONTROLLER",
          type: "put-into-inkwell",
        },
        type: "optional",
      },
      id: "1wt-1",
      name: "MEASURE ME AGAIN",
      text: "MEASURE ME AGAIN When you play this character, you may put a card from your hand into your inkwell facedown and exerted.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  cardNumber: 157,
  cardType: "character",
  classifications: ["Storyborn", "Ally"],
  cost: 2,
  externalIds: {
    ravensburger: "f80eee1a0d8f58f63e04f6f9578c9d603326d912",
  },
  franchise: "Emperors New Groove",
  fullName: "Tipo - Growing Son",
  id: "1wt",
  inkType: ["sapphire"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Tipo",
  set: "005",
  strength: 1,
  text: "MEASURE ME AGAIN When you play this character, you may put a card from your hand into your inkwell facedown and exerted.",
  version: "Growing Son",
  willpower: 2,
};
