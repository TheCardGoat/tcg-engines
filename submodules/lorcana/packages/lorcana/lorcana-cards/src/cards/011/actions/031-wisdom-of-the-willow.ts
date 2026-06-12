import type { ActionCard } from "@tcg/lorcana-types";
import { wisdomOfTheWillowI18n } from "./031-wisdom-of-the-willow.i18n";

export const wisdomOfTheWillow: ActionCard = {
  id: "aZ8",
  canonicalId: "ci_aZ8",
  reprints: ["set11-031"],
  cardType: "action",
  name: "Wisdom of the Willow",
  inkType: ["amber"],
  franchise: "Pocahontas",
  set: "011",
  cardNumber: 31,
  rarity: "uncommon",
  cost: 4,
  inkable: false,
  externalIds: {
    lorcast: "crd_9efb436da763484ba54c2b75e1e0fcd9",
    tcgPlayer: 674831,
  },
  text: "For the rest of this turn, whenever one of your characters quests, you may draw a card.",
  abilities: [
    {
      id: "1aj-1",
      effect: {
        lifecycle: {
          kind: "floating",
          duration: "this-turn",
        },
        ability: {
          trigger: {
            event: "quest",
            on: "YOUR_CHARACTERS",
            timing: "whenever",
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
        },
        type: "create-triggered-ability",
      },
      type: "action",
      text: "For the rest of this turn, whenever one of your characters quests, you may draw a card.",
    },
  ],
  i18n: wisdomOfTheWillowI18n,
};
