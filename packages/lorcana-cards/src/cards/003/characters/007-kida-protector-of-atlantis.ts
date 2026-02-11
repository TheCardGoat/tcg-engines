import type { CharacterCard } from "@tcg/lorcana-types";

export const kidaProtectorOfAtlantis: CharacterCard = {
  abilities: [
    {
      cost: {
        ink: 3,
      },
      id: "194-1",
      keyword: "Shift",
      text: "Shift 3",
      type: "keyword",
    },
    {
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: -3,
        target: "CHOSEN_CHARACTER",
      },
      id: "194-2",
      name: "PERHAPS WE CAN SAVE OUR FUTURE",
      text: "PERHAPS WE CAN SAVE OUR FUTURE When you play this character, all characters get -3 {S} until the start of your next turn.",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      type: "triggered",
    },
  ],
  cardNumber: 7,
  cardType: "character",
  classifications: ["Floodborn", "Hero", "Princess"],
  cost: 5,
  externalIds: {
    ravensburger: "a4c575df157436357fc9a63b3d4939d878e0384d",
  },
  franchise: "Atlantis",
  fullName: "Kida - Protector of Atlantis",
  id: "194",
  inkType: ["amber"],
  inkable: true,
  lore: 2,
  missingTests: true,
  name: "Kida",
  set: "003",
  strength: 3,
  text: "Shift 3 (You may pay 3 {I} to play this on top of one of your characters named Kida.)\nPERHAPS WE CAN SAVE OUR FUTURE When you play this character, all characters get -3 {S} until the start of your next turn.",
  version: "Protector of Atlantis",
  willpower: 5,
};
