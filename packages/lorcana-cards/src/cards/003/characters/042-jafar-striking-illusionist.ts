import type { CharacterCard } from "@tcg/lorcana-types";

export const jafarStrikingIllusionist: CharacterCard = {
  id: "1nu",
  cardType: "character",
  name: "Jafar",
  version: "Striking Illusionist",
  fullName: "Jafar - Striking Illusionist",
  inkType: ["amethyst"],
  franchise: "Aladdin",
  set: "003",
  text: "Shift 5 (You may pay 5 {I} to play this on top of one of your characters named Jafar.)\nEvasive (Only characters with Evasive can challenge this character.)\nPOWER BEYOND MEASURE During your turn, while this character is exerted, whenever you draw a card, gain 1 lore.",
  cost: 7,
  strength: 4,
  willpower: 5,
  lore: 1,
  cardNumber: 42,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "d7bc114b05b2a9acf333a7ac61dcd6201048884f",
  },
  abilities: [
    {
      id: "1nu-1",
      type: "keyword",
      keyword: "Shift",
      cost: {
        ink: 5,
      },
      text: "Shift 5",
    },
    {
      id: "1nu-2",
      type: "keyword",
      keyword: "Evasive",
      text: "Evasive",
    },
    {
      id: "1nu-3",
      type: "action",
      effect: {
        type: "gain-lore",
        amount: 1,
      },
      text: "POWER BEYOND MEASURE During your turn, while this character is exerted, whenever you draw a card, gain 1 lore.",
    },
  ],
  classifications: ["Floodborn", "Villain", "Sorcerer"],
};
