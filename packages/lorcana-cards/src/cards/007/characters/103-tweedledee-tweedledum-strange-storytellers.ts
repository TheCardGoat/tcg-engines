import type { CharacterCard } from "@tcg/lorcana-types";

export const tweedledeeTweedledumStrangeStorytellers: CharacterCard = {
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          target: {
            cardTypes: ["character"],
            count: 1,
            owner: "any",
            selector: "chosen",
            zones: ["play"],
          },
          type: "return-to-hand",
        },
        type: "optional",
      },
      id: "1i9-1",
      name: "ANOTHER RECITATION",
      text: "ANOTHER RECITATION Whenever this character quests, you may return chosen damaged character to their player's hand.",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  cardNumber: 103,
  cardType: "character",
  classifications: ["Storyborn"],
  cost: 5,
  externalIds: {
    ravensburger: "c398f0b7dad3ae90647cd655f39c3337fb9a5ce4",
  },
  franchise: "Alice in Wonderland",
  fullName: "Tweedledee & Tweedledum - Strange Storytellers",
  id: "1i9",
  inkType: ["emerald", "ruby"],
  inkable: true,
  lore: 2,
  missingTests: true,
  name: "Tweedledee & Tweedledum",
  set: "007",
  strength: 4,
  text: "ANOTHER RECITATION Whenever this character quests, you may return chosen damaged character to their player's hand.",
  version: "Strange Storytellers",
  willpower: 4,
};
