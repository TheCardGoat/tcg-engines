import type { CharacterCard } from "@tcg/lorcana-types";

export const tananaWiseWoman: CharacterCard = {
  id: "1b7",
  cardType: "character",
  name: "Tanana",
  version: "Wise Woman",
  fullName: "Tanana - Wise Woman",
  inkType: ["sapphire"],
  franchise: "Brother Bear",
  set: "005",
  text: "YOUR BROTHERS NEED GUIDANCE When you play this character, you may remove up to 1 damage from chosen character or location.",
  cost: 2,
  strength: 1,
  willpower: 3,
  lore: 1,
  cardNumber: 156,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "abb164419a1662267b844213eb8ebf1ee2c6dce6",
  },
  abilities: [
    {
      id: "1b7-1",
      type: "triggered",
      name: "YOUR BROTHERS NEED GUIDANCE",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "optional",
        effect: {
          type: "remove-damage",
          amount: 1,
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
      text: "YOUR BROTHERS NEED GUIDANCE When you play this character, you may remove up to 1 damage from chosen character or location.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
};
