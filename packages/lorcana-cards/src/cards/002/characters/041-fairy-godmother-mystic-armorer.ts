import type { CharacterCard } from "@tcg/lorcana-types";

export const fairyGodmotherMysticArmorer: CharacterCard = {
  id: "fq8",
  cardType: "character",
  name: "Fairy Godmother",
  version: "Mystic Armorer",
  fullName: "Fairy Godmother - Mystic Armorer",
  inkType: ["amethyst"],
  franchise: "Cinderella",
  set: "002",
  text: "Shift 2 (You may pay 2 {I} to play this on top of one of your characters named Fairy Godmother.)\nFORGET THE COACH, HERE'S A SWORD Whenever this character quests, your characters gain Challenger +3 and “When this character is banished in a challenge, return this card to your hand” this turn. (They get +3 {S} while challenging.)",
  cost: 5,
  strength: 3,
  willpower: 4,
  lore: 2,
  cardNumber: 41,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "38afe33729ebebc667c2357984ce9c75a090da76",
  },
  abilities: [
    {
      id: "fq8-1",
      type: "keyword",
      keyword: "Shift",
      cost: {
        ink: 2,
      },
      text: "Shift 2",
    },
    {
      id: "fq8-2",
      type: "static",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "gain-keyword",
            keyword: "Challenger",
            target: "SELF",
            value: 3,
          },
          {
            type: "return-to-hand",
            target: "SELF",
          },
        ],
      },
      text: "FORGET THE COACH, HERE'S A SWORD Whenever this character quests, your characters gain Challenger +3 and “When this character is banished in a challenge, return this card to your hand” this turn.",
    },
  ],
  classifications: ["Floodborn", "Mentor", "Fairy"],
};
