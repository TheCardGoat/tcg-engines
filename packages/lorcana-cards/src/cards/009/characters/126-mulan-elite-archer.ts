import type { CharacterCard } from "@tcg/lorcana-types";

export const mulanEliteArcher: CharacterCard = {
  abilities: [
    {
      cost: {
        ink: 5,
      },
      id: "1w1-1",
      keyword: "Shift",
      text: "Shift 5 {I}",
      type: "keyword",
    },
    {
      effect: {
        type: "conditional",
        condition: {
          type: "if",
          expression: "you used Shift to play her",
        },
        then: {
          type: "modify-stat",
          stat: "strength",
          modifier: 3,
          target: "CHOSEN_CHARACTER",
          duration: "this-turn",
        },
      },
      id: "1w1-2",
      name: "STRAIGHT SHOOTER",
      text: "STRAIGHT SHOOTER When you play this character, if you used Shift to play her, she gets +3 {S} this turn.",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      type: "triggered",
    },
  ],
  cardNumber: 126,
  cardType: "character",
  classifications: ["Floodborn", "Hero", "Princess"],
  cost: 6,
  externalIds: {
    ravensburger: "06e306a4259dd86efa3be5c32d8bc2d7de24b052",
  },
  franchise: "Mulan",
  fullName: "Mulan - Elite Archer",
  id: "1w1",
  inkType: ["ruby"],
  inkable: true,
  lore: 2,
  missingImplementation: true,
  missingTests: true,
  name: "Mulan",
  set: "009",
  strength: 2,
  text: "Shift 5 {I} (You may pay 5 {I} to play this on top of one of your characters named Mulan.)\nSTRAIGHT SHOOTER When you play this character, if you used Shift to play her, she gets +3 {S} this turn.\nTRIPLE SHOT During your turn, whenever this character deals damage to another character in a challenge, deal the same amount of damage to up to 2 other chosen characters.",
  version: "Elite Archer",
  willpower: 6,
};
