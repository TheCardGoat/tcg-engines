import type { CharacterCard } from "@tcg/lorcana-types";

export const johnSilverSternCaptain: CharacterCard = {
  id: "19b",
  cardType: "character",
  name: "John Silver",
  version: "Stern Captain",
  fullName: "John Silver - Stern Captain",
  inkType: ["steel"],
  franchise: "Treasure Planet",
  set: "006",
  text: "Shift 5 (You may pay 5 {I} to play this on top of one of your characters named John Silver.)\nResist +2 (Damage dealt to this character is reduced by 2.)\nDON'T JUST SIT THERE! At the start of your turn, deal 1 damage to each opposing ready character.",
  cost: 8,
  strength: 6,
  willpower: 6,
  lore: 2,
  cardNumber: 194,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "a35533a3e2773a11318e05fb7d0179e1f4f32b3d",
  },
  abilities: [],
  classifications: ["Floodborn", "Villain", "Alien", "Pirate", "Captain"],
};
