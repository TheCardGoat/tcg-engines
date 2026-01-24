import type { CharacterCard } from "@tcg/lorcana-types";

export const powerlineMusicalSuperstar: CharacterCard = {
  id: "yez",
  cardType: "character",
  name: "Powerline",
  version: "Musical Superstar",
  fullName: "Powerline - Musical Superstar",
  inkType: ["ruby"],
  franchise: "Goofy Movie",
  set: "009",
  text: "ELECTRIC MOVE If you've played a song this turn, this character gains Rush this turn. (They can challenge the turn they're played.)",
  cost: 3,
  strength: 4,
  willpower: 3,
  lore: 1,
  cardNumber: 117,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "7c09ff334bb918873fd9fc6d51c903bd4edfce46",
  },
  abilities: [
    {
      id: "yez-1",
      type: "action",
      effect: {
        type: "conditional",
        condition: {
          type: "if",
          expression: "you've played a song this turn",
        },
        then: {
          type: "gain-keyword",
          keyword: "Rush",
          target: "SELF",
          duration: "this-turn",
        },
      },
      text: "ELECTRIC MOVE If you've played a song this turn, this character gains Rush this turn.",
    },
  ],
  classifications: ["Storyborn"],
};
