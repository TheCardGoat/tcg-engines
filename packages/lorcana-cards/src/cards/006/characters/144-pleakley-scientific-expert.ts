import type { CharacterCard } from "@tcg/lorcana-types";

export const pleakleyScientificExpert: CharacterCard = {
  id: "159",
  cardType: "character",
  name: "Pleakley",
  version: "Scientific Expert",
  fullName: "Pleakley - Scientific Expert",
  inkType: ["sapphire"],
  franchise: "Lilo and Stitch",
  set: "006",
  text: "REPORTING FOR DUTY When you play this character, put chosen character of yours into your inkwell facedown and exerted.",
  cost: 3,
  strength: 3,
  willpower: 4,
  lore: 1,
  cardNumber: 144,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "94ae4dc4c313e3605e27d113d392e6156f90089a",
  },
  abilities: [
    {
      id: "159-1",
      type: "triggered",
      name: "REPORTING FOR DUTY",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "put-into-inkwell",
        source: "chosen-character",
        target: "CONTROLLER",
        exerted: true,
        facedown: true,
      },
      text: "REPORTING FOR DUTY When you play this character, put chosen character of yours into your inkwell facedown and exerted.",
    },
  ],
  classifications: ["Storyborn", "Ally", "Alien"],
};
