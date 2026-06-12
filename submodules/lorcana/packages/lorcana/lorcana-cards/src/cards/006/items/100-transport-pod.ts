import type { ItemCard } from "@tcg/lorcana-types";
import { transportPodI18n } from "./100-transport-pod.i18n";

export const transportPod: ItemCard = {
  id: "prE",
  canonicalId: "ci_prE",
  reprints: ["set6-100"],
  cardType: "item",
  name: "Transport Pod",
  inkType: ["emerald"],
  franchise: "Big Hero 6",
  set: "006",
  cardNumber: 100,
  rarity: "uncommon",
  cost: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_9d508f285a934e1fbdd5182fc46734b9",
    tcgPlayer: 593046,
  },
  text: [
    {
      title: "GIVE 'EM A SHOW",
      description:
        "At the start of your turn, you may move a character of yours to a location for free.",
    },
  ],
  abilities: [
    {
      id: "5nq-1",
      name: "GIVE 'EM A SHOW",
      type: "triggered",
      trigger: {
        event: "start-turn",
        on: "YOU",
        timing: "at",
      },
      effect: {
        type: "optional",
        chooser: "CONTROLLER",
        effect: {
          type: "move-to-location",
          character: "CHOSEN_CHARACTER_OF_YOURS",
          location: {
            selector: "chosen",
            count: 1,
            owner: "you",
            zones: ["play"],
            cardTypes: ["location"],
          },
          cost: "free",
        },
      },
      text: "GIVE 'EM A SHOW At the start of your turn, you may move a character of yours to a location for free.",
    },
  ],
  i18n: transportPodI18n,
};
