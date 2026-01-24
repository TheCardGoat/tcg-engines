import type { CharacterCard } from "@tcg/lorcana-types";

export const mickeyMouseInspirationalWarrior: CharacterCard = {
  id: "vri",
  cardType: "character",
  name: "Mickey Mouse",
  version: "Inspirational Warrior",
  fullName: "Mickey Mouse - Inspirational Warrior",
  inkType: ["steel"],
  set: "007",
  text: "STIRRING SPIRIT During your turn, whenever this character banishes another character in a challenge, you may play a character for free.",
  cost: 2,
  strength: 1,
  willpower: 1,
  lore: 1,
  cardNumber: 200,
  inkable: false,
  missingTests: true,
  externalIds: {
    ravensburger: "727b46485183fb5777acda6297c425330554ddff",
  },
  abilities: [
    {
      id: "vri-1",
      type: "triggered",
      name: "STIRRING SPIRIT",
      trigger: {
        event: "banish",
        timing: "whenever",
        on: "OPPONENT_CHARACTERS",
      },
      effect: {
        type: "optional",
        effect: {
          type: "play-card",
          from: "hand",
          cardType: "character",
          cost: "free",
        },
        chooser: "CONTROLLER",
      },
      text: "STIRRING SPIRIT During your turn, whenever this character banishes another character in a challenge, you may play a character for free.",
    },
  ],
  classifications: ["Dreamborn", "Hero"],
};
