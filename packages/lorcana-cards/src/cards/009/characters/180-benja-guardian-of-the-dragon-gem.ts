import type { CharacterCard } from "@tcg/lorcana-types";

export const benjaGuardianOfTheDragonGem: CharacterCard = {
  abilities: [
    {
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
      id: "14h-1",
      name: "WE HAVE A CHOICE",
      text: "WE HAVE A CHOICE When you play this character, you may banish chosen item.",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      type: "triggered",
    },
  ],
  cardNumber: 180,
  cardType: "character",
  classifications: ["Storyborn", "Mentor", "King"],
  cost: 3,
  externalIds: {
    ravensburger: "91f61fcecd0f1ec5ba977e234746108beae719d3",
  },
  franchise: "Raya and the Last Dragon",
  fullName: "Benja - Guardian of the Dragon Gem",
  id: "14h",
  inkType: ["steel"],
  inkable: true,
  lore: 2,
  missingTests: true,
  name: "Benja",
  set: "009",
  strength: 2,
  text: "WE HAVE A CHOICE When you play this character, you may banish chosen item.",
  version: "Guardian of the Dragon Gem",
  willpower: 3,
};
