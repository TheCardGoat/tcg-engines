import type { CharacterCard } from "@tcg/lorcana-types";

export const vanellopeVonSchweetzCandyMechanic: CharacterCard = {
  abilities: [
    {
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: -1,
        target: "SELF",
      },
      id: "18i-1",
      name: "YOU'VE GOT TO PAY TO PLAY",
      text: "YOU'VE GOT TO PAY TO PLAY Whenever this character quests, chosen opposing character gets -1 {S} until the start of your next turn.",
      trigger: {
        event: "quest",
        timing: "whenever",
        on: "SELF",
      },
      type: "triggered",
    },
  ],
  cardNumber: 9,
  cardType: "character",
  classifications: ["Dreamborn", "Hero", "Princess", "Racer"],
  cost: 2,
  externalIds: {
    ravensburger: "a074d9a5fe4ec9e9905316dcc6f56e1a9de0a03b",
  },
  franchise: "Wreck It Ralph",
  fullName: "Vanellope von Schweetz - Candy Mechanic",
  id: "18i",
  inkType: ["amber"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Vanellope von Schweetz",
  set: "005",
  strength: 2,
  text: "YOU'VE GOT TO PAY TO PLAY Whenever this character quests, chosen opposing character gets -1 {S} until the start of your next turn.",
  version: "Candy Mechanic",
  willpower: 2,
};
