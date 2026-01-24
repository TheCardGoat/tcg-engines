import type { CharacterCard } from "@tcg/lorcana-types";

export const benjaGuardianOfTheDragonGem: CharacterCard = {
  id: "14h",
  cardType: "character",
  name: "Benja",
  version: "Guardian of the Dragon Gem",
  fullName: "Benja - Guardian of the Dragon Gem",
  inkType: ["steel"],
  franchise: "Raya and the Last Dragon",
  set: "009",
  text: "WE HAVE A CHOICE When you play this character, you may banish chosen item.",
  cost: 3,
  strength: 2,
  willpower: 3,
  lore: 2,
  cardNumber: 180,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "91f61fcecd0f1ec5ba977e234746108beae719d3",
  },
  abilities: [
    {
      id: "14h-1",
      type: "triggered",
      name: "WE HAVE A CHOICE",
      trigger: {
        event: "play",
        timing: "when",
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
      text: "WE HAVE A CHOICE When you play this character, you may banish chosen item.",
    },
  ],
  classifications: ["Storyborn", "Mentor", "King"],
};
