import type { CharacterCard } from "@tcg/lorcana-types";

export const kingOfHeartsMonarchOfWonderland: CharacterCard = {
  id: "3sp",
  cardType: "character",
  name: "King of Hearts",
  version: "Monarch of Wonderland",
  fullName: "King of Hearts - Monarch of Wonderland",
  inkType: ["amethyst"],
  franchise: "Alice in Wonderland",
  set: "005",
  text: "PLEASING THE QUEEN {E} — Chosen exerted character can't ready at the start of their next turn.",
  cost: 4,
  strength: 1,
  willpower: 4,
  lore: 2,
  cardNumber: 57,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "0daff0afef432846506fd1740303222ded737937",
  },
  abilities: [
    {
      id: "3sp-1",
      type: "activated",
      cost: { exert: true },
      effect: {
        type: "restriction",
        restriction: "cant-ready",
        target: "SELF",
        duration: "until-start-of-next-turn",
      },
      text: "PLEASING THE QUEEN {E} — Chosen exerted character can't ready at the start of their next turn.",
    },
  ],
  classifications: ["Storyborn", "Ally", "King"],
};
