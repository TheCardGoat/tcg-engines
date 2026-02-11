import type { CharacterCard } from "@tcg/lorcana-types";

export const kingOfHeartsMonarchOfWonderland: CharacterCard = {
  abilities: [
    {
      cost: { exert: true },
      effect: {
        type: "restriction",
        restriction: "cant-ready",
        target: "SELF",
        duration: "until-start-of-next-turn",
      },
      id: "3sp-1",
      text: "PLEASING THE QUEEN {E} — Chosen exerted character can't ready at the start of their next turn.",
      type: "activated",
    },
  ],
  cardNumber: 57,
  cardType: "character",
  classifications: ["Storyborn", "Ally", "King"],
  cost: 4,
  externalIds: {
    ravensburger: "0daff0afef432846506fd1740303222ded737937",
  },
  franchise: "Alice in Wonderland",
  fullName: "King of Hearts - Monarch of Wonderland",
  id: "3sp",
  inkType: ["amethyst"],
  inkable: true,
  lore: 2,
  missingTests: true,
  name: "King of Hearts",
  set: "005",
  strength: 1,
  text: "PLEASING THE QUEEN {E} — Chosen exerted character can't ready at the start of their next turn.",
  version: "Monarch of Wonderland",
  willpower: 4,
};
