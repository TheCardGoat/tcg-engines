import type { CharacterCard } from "@tcg/lorcana-types";

export const triggerNotsosharpShooter: CharacterCard = {
  id: "125",
  cardType: "character",
  name: "Trigger",
  version: "Not-So-Sharp Shooter",
  fullName: "Trigger - Not-So-Sharp Shooter",
  inkType: ["ruby"],
  franchise: "Robin Hood",
  set: "003",
  text: "OLD BETSY Your characters named Nutsy get +1 {L}.",
  cost: 2,
  strength: 3,
  willpower: 1,
  lore: 1,
  cardNumber: 126,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "8b2da5c9c177bac4e285d0fbfae3e11d7ffe9792",
  },
  abilities: [
    {
      id: "125-1",
      type: "action",
      effect: {
        type: "modify-stat",
        stat: "lore",
        modifier: 1,
        target: "YOUR_CHARACTERS",
      },
      text: "OLD BETSY Your characters named Nutsy get +1 {L}.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
};
