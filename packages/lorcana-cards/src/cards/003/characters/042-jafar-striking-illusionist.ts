import type { CharacterCard } from "@tcg/lorcana-types";

export const jafarStrikingIllusionist: CharacterCard = {
  abilities: [
    {
      cost: {
        ink: 5,
      },
      id: "1nu-1",
      keyword: "Shift",
      text: "Shift 5",
      type: "keyword",
    },
    {
      id: "1nu-2",
      keyword: "Evasive",
      text: "Evasive",
      type: "keyword",
    },
    {
      effect: {
        type: "gain-lore",
        amount: 1,
      },
      id: "1nu-3",
      text: "POWER BEYOND MEASURE During your turn, while this character is exerted, whenever you draw a card, gain 1 lore.",
      type: "action",
    },
  ],
  cardNumber: 42,
  cardType: "character",
  classifications: ["Floodborn", "Villain", "Sorcerer"],
  cost: 7,
  externalIds: {
    ravensburger: "d7bc114b05b2a9acf333a7ac61dcd6201048884f",
  },
  franchise: "Aladdin",
  fullName: "Jafar - Striking Illusionist",
  id: "1nu",
  inkType: ["amethyst"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Jafar",
  set: "003",
  strength: 4,
  text: "Shift 5 (You may pay 5 {I} to play this on top of one of your characters named Jafar.)\nEvasive (Only characters with Evasive can challenge this character.)\nPOWER BEYOND MEASURE During your turn, while this character is exerted, whenever you draw a card, gain 1 lore.",
  version: "Striking Illusionist",
  willpower: 5,
};
