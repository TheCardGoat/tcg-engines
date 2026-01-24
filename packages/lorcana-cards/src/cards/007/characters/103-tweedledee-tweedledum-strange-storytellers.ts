import type { CharacterCard } from "@tcg/lorcana-types";

export const tweedledeeTweedledumStrangeStorytellers: CharacterCard = {
  id: "1i9",
  cardType: "character",
  name: "Tweedledee & Tweedledum",
  version: "Strange Storytellers",
  fullName: "Tweedledee & Tweedledum - Strange Storytellers",
  inkType: ["emerald", "ruby"],
  franchise: "Alice in Wonderland",
  set: "007",
  text: "ANOTHER RECITATION Whenever this character quests, you may return chosen damaged character to their player's hand.",
  cost: 5,
  strength: 4,
  willpower: 4,
  lore: 2,
  cardNumber: 103,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "c398f0b7dad3ae90647cd655f39c3337fb9a5ce4",
  },
  abilities: [
    {
      id: "1i9-1",
      type: "triggered",
      name: "ANOTHER RECITATION",
      trigger: {
        event: "quest",
        timing: "whenever",
        on: "SELF",
      },
      effect: {
        type: "optional",
        effect: {
          type: "return-to-hand",
          target: {
            selector: "chosen",
            count: 1,
            owner: "any",
            zones: ["play"],
            cardTypes: ["character"],
          },
        },
        chooser: "CONTROLLER",
      },
      text: "ANOTHER RECITATION Whenever this character quests, you may return chosen damaged character to their player's hand.",
    },
  ],
  classifications: ["Storyborn"],
};
