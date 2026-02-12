import type { CharacterCard } from "@tcg/lorcana-types";

export const aladdinIntrepidCommander: CharacterCard = {
  abilities: [
    {
      cost: {
        ink: 2,
      },
      id: "z1l-1",
      keyword: "Shift",
      text: "Shift 2",
      type: "keyword",
    },
    {
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: 2,
        target: "YOUR_CHARACTERS",
        duration: "this-turn",
      },
      id: "z1l-2",
      name: "REMEMBER YOUR TRAINING",
      text: "REMEMBER YOUR TRAINING When you play this character, your characters get +2 {S} this turn.",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      type: "triggered",
    },
  ],
  cardNumber: 119,
  cardType: "character",
  classifications: ["Floodborn", "Hero", "Prince"],
  cost: 4,
  externalIds: {
    ravensburger: "7e4d253d23bf3576df52bdc66b20bd353eea56dd",
  },
  franchise: "Aladdin",
  fullName: "Aladdin - Intrepid Commander",
  id: "z1l",
  inkType: ["ruby"],
  inkable: true,
  lore: 2,
  missingTests: true,
  name: "Aladdin",
  set: "006",
  strength: 1,
  text: "Shift 2 (You may pay 2 {I} to play this on top of one of your characters named Aladdin.)\nREMEMBER YOUR TRAINING When you play this character, your characters get +2 {S} this turn.",
  version: "Intrepid Commander",
  willpower: 4,
};
