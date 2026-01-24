import type { CharacterCard } from "@tcg/lorcana-types";

export const alistairKreiAmbitiousEntrepreneur: CharacterCard = {
  id: "ppn",
  cardType: "character",
  name: "Alistair Krei",
  version: "Ambitious Entrepreneur",
  fullName: "Alistair Krei - Ambitious Entrepreneur",
  inkType: ["emerald"],
  franchise: "Big Hero 6",
  set: "006",
  text: "AN EYE FOR TECH When you play this character, if an opponent has an item in play, gain 1 lore.",
  cost: 3,
  strength: 2,
  willpower: 4,
  lore: 1,
  cardNumber: 87,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "5caba947c087604d4db6f1463a4c61faab71effb",
  },
  abilities: [
    {
      id: "ppn-1",
      type: "triggered",
      name: "AN EYE FOR TECH",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "conditional",
        condition: {
          type: "if",
          expression: "an opponent has an item in play",
        },
        then: {
          type: "gain-lore",
          amount: 1,
        },
      },
      text: "AN EYE FOR TECH When you play this character, if an opponent has an item in play, gain 1 lore.",
    },
  ],
  classifications: ["Storyborn", "Inventor"],
};
