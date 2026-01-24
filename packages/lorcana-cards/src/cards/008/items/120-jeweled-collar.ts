import type { ItemCard } from "@tcg/lorcana-types";

export const jeweledCollar: ItemCard = {
  id: "19v",
  cardType: "item",
  name: "Jeweled Collar",
  inkType: ["emerald", "sapphire"],
  franchise: "Aristocats",
  set: "008",
  text: "WELCOME EXTRAVAGANCE Whenever one of your characters is challenged, you may put the top card of your deck into your inkwell facedown and exerted.",
  cost: 2,
  cardNumber: 120,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "a55f40c14f531761828d5025ffb3cade2560095f",
  },
  abilities: [
    {
      id: "19v-1",
      type: "triggered",
      name: "WELCOME EXTRAVAGANCE",
      trigger: {
        event: "banish",
        timing: "whenever",
        on: "YOUR_OTHER_CHARACTERS",
      },
      effect: {
        type: "optional",
        effect: {
          type: "put-into-inkwell",
          source: "top-of-deck",
          target: "CONTROLLER",
          exerted: true,
          facedown: true,
        },
        chooser: "CONTROLLER",
      },
      text: "WELCOME EXTRAVAGANCE Whenever one of your characters is challenged, you may put the top card of your deck into your inkwell facedown and exerted.",
    },
  ],
};
