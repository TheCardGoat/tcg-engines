import type { CharacterCard } from "@tcg/lorcana-types";

export const pleakleyScientificExpert: CharacterCard = {
  abilities: [
    {
      effect: {
        exerted: true,
        facedown: true,
        source: "chosen-character",
        target: "CONTROLLER",
        type: "put-into-inkwell",
      },
      id: "159-1",
      name: "REPORTING FOR DUTY",
      text: "REPORTING FOR DUTY When you play this character, put chosen character of yours into your inkwell facedown and exerted.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  cardNumber: 144,
  cardType: "character",
  classifications: ["Storyborn", "Ally", "Alien"],
  cost: 3,
  externalIds: {
    ravensburger: "94ae4dc4c313e3605e27d113d392e6156f90089a",
  },
  franchise: "Lilo and Stitch",
  fullName: "Pleakley - Scientific Expert",
  id: "159",
  inkType: ["sapphire"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Pleakley",
  set: "006",
  strength: 3,
  text: "REPORTING FOR DUTY When you play this character, put chosen character of yours into your inkwell facedown and exerted.",
  version: "Scientific Expert",
  willpower: 4,
};
