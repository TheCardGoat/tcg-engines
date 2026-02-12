import type { ItemCard } from "@tcg/lorcana-types";

export const jeweledCollar: ItemCard = {
  abilities: [
    {
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
      id: "19v-1",
      name: "WELCOME EXTRAVAGANCE",
      text: "WELCOME EXTRAVAGANCE Whenever one of your characters is challenged, you may put the top card of your deck into your inkwell facedown and exerted.",
      trigger: {
        event: "banish",
        timing: "whenever",
        on: "YOUR_OTHER_CHARACTERS",
      },
      type: "triggered",
    },
  ],
  cardNumber: 120,
  cardType: "item",
  cost: 2,
  externalIds: {
    ravensburger: "a55f40c14f531761828d5025ffb3cade2560095f",
  },
  franchise: "Aristocats",
  id: "19v",
  inkType: ["emerald", "sapphire"],
  inkable: true,
  missingTests: true,
  name: "Jeweled Collar",
  set: "008",
  text: "WELCOME EXTRAVAGANCE Whenever one of your characters is challenged, you may put the top card of your deck into your inkwell facedown and exerted.",
};
