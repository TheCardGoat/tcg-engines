import type { CharacterCard } from "@tcg/lorcana-types";

export const vanellopeVonSchweetzCandyMechanic: CharacterCard = {
  id: "18i",
  cardType: "character",
  name: "Vanellope von Schweetz",
  version: "Candy Mechanic",
  fullName: "Vanellope von Schweetz - Candy Mechanic",
  inkType: ["amber"],
  franchise: "Wreck It Ralph",
  set: "005",
  text: "YOU'VE GOT TO PAY TO PLAY Whenever this character quests, chosen opposing character gets -1 {S} until the start of your next turn.",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
  cardNumber: 9,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "a074d9a5fe4ec9e9905316dcc6f56e1a9de0a03b",
  },
  abilities: [
    {
      id: "18i-1",
      type: "triggered",
      name: "YOU'VE GOT TO PAY TO PLAY",
      trigger: {
        event: "quest",
        timing: "whenever",
        on: "SELF",
      },
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: -1,
        target: "SELF",
      },
      text: "YOU'VE GOT TO PAY TO PLAY Whenever this character quests, chosen opposing character gets -1 {S} until the start of your next turn.",
    },
  ],
  classifications: ["Dreamborn", "Hero", "Princess", "Racer"],
};
