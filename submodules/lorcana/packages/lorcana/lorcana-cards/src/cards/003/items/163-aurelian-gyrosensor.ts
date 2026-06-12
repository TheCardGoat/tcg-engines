import type { ItemCard } from "@tcg/lorcana-types";
import { aurelianGyrosensorI18n } from "./163-aurelian-gyrosensor.i18n";

export const aurelianGyrosensor: ItemCard = {
  id: "kHJ",
  canonicalId: "ci_RAl",
  reprints: ["set3-163", "set9-167"],
  cardType: "item",
  name: "Aurelian Gyrosensor",
  inkType: ["sapphire"],
  franchise: "Lorcana",
  set: "003",
  cardNumber: 163,
  rarity: "rare",
  cost: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_6e6d5ca027b34def81032f79864dc6c6",
    tcgPlayer: 650101,
  },
  text: [
    {
      title: "SEEKING KNOWLEDGE",
      description:
        "Whenever one of your characters quests, you may look at the top card of your deck. Put it on either the top or the bottom of your deck.",
    },
  ],
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          amount: 1,
          destinations: [
            {
              zone: "deck-top",
              min: 0,
              max: 1,
            },
            {
              zone: "deck-bottom",
              remainder: true,
            },
          ],
          target: "CONTROLLER",
          type: "scry",
        },
        type: "optional",
      },
      id: "811-1",
      name: "SEEKING KNOWLEDGE",
      text: "SEEKING KNOWLEDGE Whenever one of your characters quests, you may look at the top card of your deck. Put it on either the top or the bottom of your deck.",
      trigger: {
        event: "quest",
        on: "YOUR_CHARACTERS",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  i18n: aurelianGyrosensorI18n,
};
