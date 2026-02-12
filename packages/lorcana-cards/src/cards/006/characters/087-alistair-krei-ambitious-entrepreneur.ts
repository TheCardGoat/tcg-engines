import type { CharacterCard } from "@tcg/lorcana-types";

export const alistairKreiAmbitiousEntrepreneur: CharacterCard = {
  abilities: [
    {
      effect: {
        condition: {
          expression: "an opponent has an item in play",
          type: "if",
        },
        then: {
          amount: 1,
          type: "gain-lore",
        },
        type: "conditional",
      },
      id: "ppn-1",
      name: "AN EYE FOR TECH",
      text: "AN EYE FOR TECH When you play this character, if an opponent has an item in play, gain 1 lore.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  cardNumber: 87,
  cardType: "character",
  classifications: ["Storyborn", "Inventor"],
  cost: 3,
  externalIds: {
    ravensburger: "5caba947c087604d4db6f1463a4c61faab71effb",
  },
  franchise: "Big Hero 6",
  fullName: "Alistair Krei - Ambitious Entrepreneur",
  id: "ppn",
  inkType: ["emerald"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Alistair Krei",
  set: "006",
  strength: 2,
  text: "AN EYE FOR TECH When you play this character, if an opponent has an item in play, gain 1 lore.",
  version: "Ambitious Entrepreneur",
  willpower: 4,
};
