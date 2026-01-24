import type { CharacterCard } from "@tcg/lorcana-types";

export const aladdinBraveRescuer: CharacterCard = {
  id: "on2",
  cardType: "character",
  name: "Aladdin",
  version: "Brave Rescuer",
  fullName: "Aladdin - Brave Rescuer",
  inkType: ["steel"],
  franchise: "Aladdin",
  set: "004",
  text: "Shift: Discard a location card (You may discard a location card to play this on top of one of your characters named Aladdin.)\nCRASHING THROUGH Whenever this character quests, you may banish chosen item.",
  cost: 3,
  strength: 3,
  willpower: 3,
  lore: 1,
  cardNumber: 171,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "58ce9f9e7b38c0ef9c7d5b24e03675a9b0c0e182",
  },
  abilities: [
    {
      id: "on2-2",
      type: "triggered",
      name: "CRASHING THROUGH",
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
      text: "CRASHING THROUGH Whenever this character quests, you may banish chosen item.",
    },
  ],
  classifications: ["Floodborn", "Hero"],
};
