import type { CharacterCard } from "@tcg/lorcana-types";
import { monsieurDarqueDespicableProprietorI18n } from "./157-monsieur-darque-despicable-proprietor.i18n";

export const monsieurDarqueDespicableProprietor: CharacterCard = {
  id: "TnS",
  canonicalId: "ci_TnS",
  reprints: ["set7-157"],
  cardType: "character",
  name: "Monsieur D'Arque",
  version: "Despicable Proprietor",
  inkType: ["sapphire"],
  franchise: "Beauty and the Beast",
  set: "007",
  cardNumber: 157,
  rarity: "common",
  cost: 1,
  strength: 1,
  willpower: 2,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_986ba61b527b4e5f822c0c8e2d675b7d",
    tcgPlayer: 619495,
  },
  text: [
    {
      title: "I'VE COME TO COLLECT",
      description:
        "Whenever this character quests, you may banish chosen item of yours to draw a card.",
    },
  ],
  classifications: ["Storyborn", "Villain"],
  abilities: [
    {
      effect: {
        type: "sequence",
        steps: [
          {
            type: "optional",
            chooser: "CONTROLLER",
            effect: {
              type: "banish",
              target: {
                selector: "chosen",
                count: 1,
                owner: "you",
                zones: ["play"],
                cardTypes: ["item"],
              },
            },
          },
          {
            type: "conditional",
            condition: { type: "if-you-do" },
            then: {
              type: "draw",
              amount: 1,
              target: "CONTROLLER",
            },
          },
        ],
      },
      id: "116-1",
      name: "I'VE COME TO COLLECT",
      text: "I'VE COME TO COLLECT Whenever this character quests, you may banish chosen item of yours to draw a card.",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  i18n: monsieurDarqueDespicableProprietorI18n,
};
