import type { CharacterCard } from "@tcg/lorcana-types";

export const vladimirCeramicUnicornFan: CharacterCard = {
  id: "j0l",
  cardType: "character",
  name: "Vladimir",
  version: "Ceramic Unicorn Fan",
  fullName: "Vladimir - Ceramic Unicorn Fan",
  inkType: ["emerald"],
  franchise: "Tangled",
  set: "010",
  text: "HIGH STANDARDS Whenever this character quests, you may banish chosen item.",
  cost: 6,
  strength: 5,
  willpower: 6,
  lore: 2,
  cardNumber: 75,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "44893592a58c77ecae29739f2439ac935a0ee03b",
  },
  abilities: [
    {
      id: "j0l-1",
      type: "triggered",
      name: "HIGH STANDARDS",
      trigger: {
        event: "quest",
        timing: "whenever",
        on: "SELF",
      },
      effect: {
        type: "optional",
        effect: {
          type: "banish",
          target: {
            selector: "chosen",
            count: 1,
            owner: "any",
            zones: ["play"],
            cardTypes: ["item"],
          },
        },
        chooser: "CONTROLLER",
      },
      text: "HIGH STANDARDS Whenever this character quests, you may banish chosen item.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
};
