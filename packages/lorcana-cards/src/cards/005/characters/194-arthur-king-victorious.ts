import type { CharacterCard } from "@tcg/lorcana-types";

export const arthurKingVictorious: CharacterCard = {
  id: "d3q",
  cardType: "character",
  name: "Arthur",
  version: "King Victorious",
  fullName: "Arthur - King Victorious",
  inkType: ["steel"],
  franchise: "Sword in the Stone",
  set: "005",
  text: "Shift 5 (You may pay 5 {I} to play this on top of one of your characters named Arthur.)\nKNIGHTED BY THE KING When you play this character, chosen character gains Challenger +2 and Resist +2 and can challenge ready characters this turn. (They get +2 {S} while challenging. Damage dealt to them is reduced by 2.)",
  cost: 7,
  strength: 3,
  willpower: 6,
  lore: 3,
  cardNumber: 194,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "2f3a330ce28cc7aa20666f69e8e605efcffacc9b",
  },
  abilities: [],
  classifications: ["Floodborn", "Hero", "King"],
};
