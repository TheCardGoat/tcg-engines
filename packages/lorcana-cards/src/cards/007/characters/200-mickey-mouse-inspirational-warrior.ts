import type { CharacterCard } from "@tcg/lorcana-types";

export const mickeyMouseInspirationalWarrior: CharacterCard = {
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          type: "play-card",
          from: "hand",
          cardType: "character",
          cost: "free",
        },
        type: "optional",
      },
      id: "vri-1",
      name: "STIRRING SPIRIT",
      text: "STIRRING SPIRIT During your turn, whenever this character banishes another character in a challenge, you may play a character for free.",
      trigger: {
        event: "banish",
        on: "OPPONENT_CHARACTERS",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  cardNumber: 200,
  cardType: "character",
  classifications: ["Dreamborn", "Hero"],
  cost: 2,
  externalIds: {
    ravensburger: "727b46485183fb5777acda6297c425330554ddff",
  },
  fullName: "Mickey Mouse - Inspirational Warrior",
  id: "vri",
  inkType: ["steel"],
  inkable: false,
  lore: 1,
  missingTests: true,
  name: "Mickey Mouse",
  set: "007",
  strength: 1,
  text: "STIRRING SPIRIT During your turn, whenever this character banishes another character in a challenge, you may play a character for free.",
  version: "Inspirational Warrior",
  willpower: 1,
};
