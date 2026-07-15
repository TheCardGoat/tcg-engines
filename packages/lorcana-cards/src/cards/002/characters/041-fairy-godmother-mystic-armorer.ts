import type { CharacterCard } from "@tcg/lorcana-types";

export const fairyGodmotherMysticArmorer: CharacterCard = {
  abilities: [
    {
      cost: {
        ink: 2,
      },
      id: "fq8-1",
      keyword: "Shift",
      text: "Shift 2",
      type: "keyword",
    },
    {
      effect: {
        steps: [
          {
            keyword: "Challenger",
            target: "SELF",
            type: "gain-keyword",
            value: 3,
          },
          {
            target: "SELF",
            type: "return-to-hand",
          },
        ],
        type: "sequence",
      },
      id: "fq8-2",
      text: "FORGET THE COACH, HERE'S A SWORD Whenever this character quests, your characters gain Challenger +3 and “When this character is banished in a challenge, return this card to your hand” this turn.",
      type: "static",
    },
  ],
  cardNumber: 41,
  cardType: "character",
  classifications: ["Floodborn", "Mentor", "Fairy"],
  cost: 5,
  externalIds: {
    ravensburger: "38afe33729ebebc667c2357984ce9c75a090da76",
  },
  franchise: "Cinderella",
  fullName: "Fairy Godmother - Mystic Armorer",
  id: "fq8",
  inkType: ["amethyst"],
  inkable: true,
  lore: 2,
  missingTests: true,
  name: "Fairy Godmother",
  set: "002",
  strength: 3,
  text: "Shift 2 (You may pay 2 {I} to play this on top of one of your characters named Fairy Godmother.)\nFORGET THE COACH, HERE'S A SWORD Whenever this character quests, your characters gain Challenger +3 and “When this character is banished in a challenge, return this card to your hand” this turn. (They get +3 {S} while challenging.)",
  version: "Mystic Armorer",
  willpower: 4,
};
