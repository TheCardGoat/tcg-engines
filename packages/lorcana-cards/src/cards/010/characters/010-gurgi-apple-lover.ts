import type { CharacterCard } from "@tcg/lorcana-types";

export const gurgiAppleLover: CharacterCard = {
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          amount: 2,
          target: {
            selector: "chosen",
            count: 1,
            owner: "any",
            zones: ["play"],
            cardTypes: ["character"],
          },
          type: "remove-damage",
          upTo: true,
        },
        type: "optional",
      },
      id: "1pr-1",
      name: "HAPPY DAY",
      text: "HAPPY DAY When you play this character, you may remove up to 2 damage from chosen character.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  cardNumber: 10,
  cardType: "character",
  classifications: ["Storyborn", "Ally"],
  cost: 2,
  externalIds: {
    ravensburger: "de9420fae42d1c05568f9e37cdeae27e27a78cd2",
  },
  franchise: "Black Cauldron",
  fullName: "Gurgi - Apple Lover",
  id: "1pr",
  inkType: ["amber"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Gurgi",
  set: "010",
  strength: 2,
  text: "HAPPY DAY When you play this character, you may remove up to 2 damage from chosen character.",
  version: "Apple Lover",
  willpower: 3,
};
