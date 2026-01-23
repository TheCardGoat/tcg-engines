import type { CharacterCard } from "@tcg/lorcana-types";

export const mulanEliteArcher: CharacterCard = {
  id: "1w1",
  cardType: "character",
  name: "Mulan",
  version: "Elite Archer",
  fullName: "Mulan - Elite Archer",
  inkType: ["ruby"],
  franchise: "Mulan",
  set: "009",
  text: "Shift 5 {I} (You may pay 5 {I} to play this on top of one of your characters named Mulan.)\nSTRAIGHT SHOOTER When you play this character, if you used Shift to play her, she gets +3 {S} this turn.\nTRIPLE SHOT During your turn, whenever this character deals damage to another character in a challenge, deal the same amount of damage to up to 2 other chosen characters.",
  cost: 6,
  strength: 2,
  willpower: 6,
  lore: 2,
  cardNumber: 126,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "06e306a4259dd86efa3be5c32d8bc2d7de24b052",
  },
  abilities: [],
  classifications: ["Floodborn", "Hero", "Princess"],
};
