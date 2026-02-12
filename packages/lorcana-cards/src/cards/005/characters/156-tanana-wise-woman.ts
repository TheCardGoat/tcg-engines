import type { CharacterCard } from "@tcg/lorcana-types";

export const tananaWiseWoman: CharacterCard = {
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          amount: 1,
          target: {
            cardTypes: ["character"],
            count: 1,
            owner: "any",
            selector: "chosen",
            zones: ["play"],
          },
          type: "remove-damage",
          upTo: true,
        },
        type: "optional",
      },
      id: "1b7-1",
      name: "YOUR BROTHERS NEED GUIDANCE",
      text: "YOUR BROTHERS NEED GUIDANCE When you play this character, you may remove up to 1 damage from chosen character or location.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  cardNumber: 156,
  cardType: "character",
  classifications: ["Storyborn", "Ally"],
  cost: 2,
  externalIds: {
    ravensburger: "abb164419a1662267b844213eb8ebf1ee2c6dce6",
  },
  franchise: "Brother Bear",
  fullName: "Tanana - Wise Woman",
  id: "1b7",
  inkType: ["sapphire"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Tanana",
  set: "005",
  strength: 1,
  text: "YOUR BROTHERS NEED GUIDANCE When you play this character, you may remove up to 1 damage from chosen character or location.",
  version: "Wise Woman",
  willpower: 3,
};
