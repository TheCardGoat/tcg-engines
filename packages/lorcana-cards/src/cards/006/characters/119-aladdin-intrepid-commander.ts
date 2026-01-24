import type { CharacterCard } from "@tcg/lorcana-types";

export const aladdinIntrepidCommander: CharacterCard = {
  id: "z1l",
  cardType: "character",
  name: "Aladdin",
  version: "Intrepid Commander",
  fullName: "Aladdin - Intrepid Commander",
  inkType: ["ruby"],
  franchise: "Aladdin",
  set: "006",
  text: "Shift 2 (You may pay 2 {I} to play this on top of one of your characters named Aladdin.)\nREMEMBER YOUR TRAINING When you play this character, your characters get +2 {S} this turn.",
  cost: 4,
  strength: 1,
  willpower: 4,
  lore: 2,
  cardNumber: 119,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "7e4d253d23bf3576df52bdc66b20bd353eea56dd",
  },
  abilities: [
    {
      id: "z1l-1",
      type: "keyword",
      keyword: "Shift",
      cost: {
        ink: 2,
      },
      text: "Shift 2",
    },
    {
      id: "z1l-2",
      type: "triggered",
      name: "REMEMBER YOUR TRAINING",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: 2,
        target: "YOUR_CHARACTERS",
        duration: "this-turn",
      },
      text: "REMEMBER YOUR TRAINING When you play this character, your characters get +2 {S} this turn.",
    },
  ],
  classifications: ["Floodborn", "Hero", "Prince"],
};
