import type { ItemCard } from "@tcg/lorcana-types";

export const aurelianGyrosensor: ItemCard = {
  id: "811",
  cardType: "item",
  name: "Aurelian Gyrosensor",
  inkType: ["sapphire"],
  franchise: "Lorcana",
  set: "009",
  text: "SEEKING KNOWLEDGE Whenever one of your characters quests, you may look at the top card of your deck. Put it on either the top or the bottom of your deck.",
  cost: 2,
  cardNumber: 167,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "1cefdacf3020720d8e94c7f2e9c50039ba1f9d22",
  },
  abilities: [
    {
      id: "811-1",
      type: "triggered",
      name: "SEEKING KNOWLEDGE",
      trigger: {
        event: "banish",
        timing: "whenever",
        on: "YOUR_OTHER_CHARACTERS",
      },
      effect: {
        type: "optional",
        effect: {
          type: "put-on-bottom",
          target: "CHOSEN_CHARACTER",
        },
        chooser: "CONTROLLER",
      },
      text: "SEEKING KNOWLEDGE Whenever one of your characters quests, you may look at the top card of your deck. Put it on either the top or the bottom of your deck.",
    },
  ],
};
