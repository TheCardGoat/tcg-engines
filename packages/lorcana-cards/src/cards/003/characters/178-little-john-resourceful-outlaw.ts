import type { CharacterCard } from "@tcg/lorcana-types";

export const littleJohnResourcefulOutlaw: CharacterCard = {
  abilities: [
    {
      cost: {
        ink: 4,
      },
      id: "kck-1",
      keyword: "Shift",
      text: "Shift 4",
      type: "keyword",
    },
    {
      effect: {
        steps: [
          {
            keyword: "Resist",
            target: "SELF",
            type: "gain-keyword",
            value: 1,
          },
          {
            modifier: 1,
            stat: "lore",
            target: "CHOSEN_CHARACTER",
            type: "modify-stat",
          },
        ],
        type: "sequence",
      },
      id: "kck-2",
      text: "OKAY, BIG SHOT While this character is exerted, your characters with Bodyguard gain Resist +1 and get +1 {L}.",
      type: "action",
    },
  ],
  cardNumber: 178,
  cardType: "character",
  classifications: ["Floodborn", "Hero"],
  cost: 6,
  externalIds: {
    ravensburger: "4956d247c5c7ffb227f85ae9fef3452d613bf2d5",
  },
  franchise: "Robin Hood",
  fullName: "Little John - Resourceful Outlaw",
  id: "kck",
  inkType: ["steel"],
  inkable: true,
  lore: 2,
  missingTests: true,
  name: "Little John",
  set: "003",
  strength: 4,
  text: "Shift 4 (You may pay 4 {I} to play this on top of one of your characters named Little John.)\nOKAY, BIG SHOT While this character is exerted, your characters with Bodyguard gain Resist +1 and get +1 {L}. (Damage dealt to them is reduced by 1.)",
  version: "Resourceful Outlaw",
  willpower: 5,
};
