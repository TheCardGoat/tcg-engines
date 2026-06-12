import type { CharacterCard } from "@tcg/lorcana-types";
import { ursulaPowerHungryI18n } from "./059-ursula-power-hungry.i18n";

export const ursulaPowerHungry: CharacterCard = {
  id: "O7h",
  canonicalId: "ci_O7h",
  reprints: ["set1-059"],
  cardType: "character",
  name: "Ursula",
  version: "Power Hungry",
  inkType: ["amethyst"],
  franchise: "Little Mermaid",
  set: "001",
  cardNumber: 59,
  rarity: "legendary",
  cost: 7,
  strength: 2,
  willpower: 8,
  lore: 3,
  inkable: false,
  externalIds: {
    lorcast: "crd_2700ee961f214ad48e6284b2a8e864dc",
    tcgPlayer: 508755,
  },
  text: [
    {
      title: "IT'S TOO EASY!",
      description:
        "When you play this character, each opponent loses 1 lore. You may draw a card for each 1 lore lost this way.",
    },
  ],
  classifications: ["Storyborn", "Villain", "Sorcerer"],
  abilities: [
    {
      id: "O7h-1",
      name: "IT'S TOO EASY!",
      text: "IT'S TOO EASY! When you play this character, each opponent loses 1 lore. You may draw a card for each 1 lore lost this way.",
      type: "triggered",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      effect: {
        type: "sequence",
        steps: [
          {
            type: "lose-lore",
            amount: 1,
            target: "EACH_OPPONENT",
          },
          {
            type: "optional",
            chooser: "CONTROLLER",
            effect: {
              type: "draw",
              amount: {
                type: "for-each",
                counter: {
                  type: "lore-lost",
                },
              },
              target: "CONTROLLER",
            },
          },
        ],
      },
    },
  ],
  i18n: ursulaPowerHungryI18n,
};
