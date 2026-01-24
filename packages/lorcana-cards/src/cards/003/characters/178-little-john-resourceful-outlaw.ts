import type { CharacterCard } from "@tcg/lorcana-types";

export const littleJohnResourcefulOutlaw: CharacterCard = {
  id: "kck",
  cardType: "character",
  name: "Little John",
  version: "Resourceful Outlaw",
  fullName: "Little John - Resourceful Outlaw",
  inkType: ["steel"],
  franchise: "Robin Hood",
  set: "003",
  text: "Shift 4 (You may pay 4 {I} to play this on top of one of your characters named Little John.)\nOKAY, BIG SHOT While this character is exerted, your characters with Bodyguard gain Resist +1 and get +1 {L}. (Damage dealt to them is reduced by 1.)",
  cost: 6,
  strength: 4,
  willpower: 5,
  lore: 2,
  cardNumber: 178,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "4956d247c5c7ffb227f85ae9fef3452d613bf2d5",
  },
  abilities: [
    {
      id: "kck-1",
      type: "keyword",
      keyword: "Shift",
      cost: {
        ink: 4,
      },
      text: "Shift 4",
    },
    {
      id: "kck-2",
      type: "action",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "gain-keyword",
            keyword: "Resist",
            target: "SELF",
            value: 1,
          },
          {
            type: "modify-stat",
            stat: "lore",
            modifier: 1,
            target: "CHOSEN_CHARACTER",
          },
        ],
      },
      text: "OKAY, BIG SHOT While this character is exerted, your characters with Bodyguard gain Resist +1 and get +1 {L}.",
    },
  ],
  classifications: ["Floodborn", "Hero"],
};
