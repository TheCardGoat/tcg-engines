import type { CharacterCard } from "@tcg/lorcana-types";

export const aladdinBraveRescuer: CharacterCard = {
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          target: {
            selector: "chosen",
            count: 1,
            owner: "any",
            zones: ["play"],
            cardTypes: ["item"],
          },
          type: "banish",
        },
        type: "optional",
      },
      id: "on2-2",
      name: "CRASHING THROUGH",
      text: "CRASHING THROUGH Whenever this character quests, you may banish chosen item.",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  cardNumber: 171,
  cardType: "character",
  classifications: ["Floodborn", "Hero"],
  cost: 3,
  externalIds: {
    ravensburger: "58ce9f9e7b38c0ef9c7d5b24e03675a9b0c0e182",
  },
  franchise: "Aladdin",
  fullName: "Aladdin - Brave Rescuer",
  id: "on2",
  inkType: ["steel"],
  inkable: true,
  lore: 1,
  missingImplementation: true,
  missingTests: true,
  name: "Aladdin",
  set: "004",
  strength: 3,
  text: "Shift: Discard a location card (You may discard a location card to play this on top of one of your characters named Aladdin.)\nCRASHING THROUGH Whenever this character quests, you may banish chosen item.",
  version: "Brave Rescuer",
  willpower: 3,
};
