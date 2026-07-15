import type { CharacterCard } from "@tcg/lorcana-types";

export const triggerNotsosharpShooter: CharacterCard = {
  abilities: [
    {
      effect: {
        modifier: 1,
        stat: "lore",
        target: "YOUR_CHARACTERS",
        type: "modify-stat",
      },
      id: "125-1",
      text: "OLD BETSY Your characters named Nutsy get +1 {L}.",
      type: "action",
    },
  ],
  cardNumber: 126,
  cardType: "character",
  classifications: ["Storyborn", "Ally"],
  cost: 2,
  externalIds: {
    ravensburger: "8b2da5c9c177bac4e285d0fbfae3e11d7ffe9792",
  },
  franchise: "Robin Hood",
  fullName: "Trigger - Not-So-Sharp Shooter",
  id: "125",
  inkType: ["ruby"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Trigger",
  set: "003",
  strength: 3,
  text: "OLD BETSY Your characters named Nutsy get +1 {L}.",
  version: "Not-So-Sharp Shooter",
  willpower: 1,
};
