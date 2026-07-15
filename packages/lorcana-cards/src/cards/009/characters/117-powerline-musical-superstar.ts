import type { CharacterCard } from "@tcg/lorcana-types";

export const powerlineMusicalSuperstar: CharacterCard = {
  abilities: [
    {
      effect: {
        condition: {
          expression: "you've played a song this turn",
          type: "if",
        },
        then: {
          duration: "this-turn",
          keyword: "Rush",
          target: "SELF",
          type: "gain-keyword",
        },
        type: "conditional",
      },
      id: "yez-1",
      text: "ELECTRIC MOVE If you've played a song this turn, this character gains Rush this turn.",
      type: "action",
    },
  ],
  cardNumber: 117,
  cardType: "character",
  classifications: ["Storyborn"],
  cost: 3,
  externalIds: {
    ravensburger: "7c09ff334bb918873fd9fc6d51c903bd4edfce46",
  },
  franchise: "Goofy Movie",
  fullName: "Powerline - Musical Superstar",
  id: "yez",
  inkType: ["ruby"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Powerline",
  set: "009",
  strength: 4,
  text: "ELECTRIC MOVE If you've played a song this turn, this character gains Rush this turn. (They can challenge the turn they're played.)",
  version: "Musical Superstar",
  willpower: 3,
};
