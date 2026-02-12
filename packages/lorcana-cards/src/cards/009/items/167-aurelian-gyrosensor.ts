import type { ItemCard } from "@tcg/lorcana-types";

export const aurelianGyrosensor: ItemCard = {
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          type: "put-on-bottom",
          target: "CHOSEN_CHARACTER",
        },
        type: "optional",
      },
      id: "811-1",
      name: "SEEKING KNOWLEDGE",
      text: "SEEKING KNOWLEDGE Whenever one of your characters quests, you may look at the top card of your deck. Put it on either the top or the bottom of your deck.",
      trigger: {
        event: "banish",
        on: "YOUR_OTHER_CHARACTERS",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  cardNumber: 167,
  cardType: "item",
  cost: 2,
  externalIds: {
    ravensburger: "1cefdacf3020720d8e94c7f2e9c50039ba1f9d22",
  },
  franchise: "Lorcana",
  id: "811",
  inkType: ["sapphire"],
  inkable: true,
  missingTests: true,
  name: "Aurelian Gyrosensor",
  set: "009",
  text: "SEEKING KNOWLEDGE Whenever one of your characters quests, you may look at the top card of your deck. Put it on either the top or the bottom of your deck.",
};
