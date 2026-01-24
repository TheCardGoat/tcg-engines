import type { CharacterCard } from "@tcg/lorcana-types";

export const gurgiAppleLover: CharacterCard = {
  id: "1pr",
  cardType: "character",
  name: "Gurgi",
  version: "Apple Lover",
  fullName: "Gurgi - Apple Lover",
  inkType: ["amber"],
  franchise: "Black Cauldron",
  set: "010",
  text: "HAPPY DAY When you play this character, you may remove up to 2 damage from chosen character.",
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
  cardNumber: 10,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "de9420fae42d1c05568f9e37cdeae27e27a78cd2",
  },
  abilities: [
    {
      id: "1pr-1",
      type: "triggered",
      name: "HAPPY DAY",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "optional",
        effect: {
          type: "remove-damage",
          amount: 2,
          upTo: true,
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
      text: "HAPPY DAY When you play this character, you may remove up to 2 damage from chosen character.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
};
