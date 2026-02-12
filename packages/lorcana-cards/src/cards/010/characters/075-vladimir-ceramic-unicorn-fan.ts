import type { CharacterCard } from "@tcg/lorcana-types";

export const vladimirCeramicUnicornFan: CharacterCard = {
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
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
        type: "optional",
      },
      id: "j0l-1",
      name: "HIGH STANDARDS",
      text: "HIGH STANDARDS Whenever this character quests, you may banish chosen item.",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  cardNumber: 75,
  cardType: "character",
  classifications: ["Storyborn", "Ally"],
  cost: 6,
  externalIds: {
    ravensburger: "44893592a58c77ecae29739f2439ac935a0ee03b",
  },
  franchise: "Tangled",
  fullName: "Vladimir - Ceramic Unicorn Fan",
  id: "j0l",
  inkType: ["emerald"],
  inkable: true,
  lore: 2,
  missingTests: true,
  name: "Vladimir",
  set: "010",
  strength: 5,
  text: "HIGH STANDARDS Whenever this character quests, you may banish chosen item.",
  version: "Ceramic Unicorn Fan",
  willpower: 6,
};
