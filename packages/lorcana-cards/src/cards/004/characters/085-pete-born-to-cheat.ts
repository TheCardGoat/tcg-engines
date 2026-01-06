import type { CharacterCard } from "@tcg/lorcana-types";

export const peteBornToCheat: CharacterCard = {
  id: "d6v",
  cardType: "character",
  name: "Pete",
  version: "Born to Cheat",
  fullName: "Pete - Born to Cheat",
  inkType: ["emerald"],
  set: "004",
  text: "I CLOBBER YOU! Whenever this character quests while he has 5 {S} or more, return chosen character with 2 {S} or less to their player's hand.",
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
  cardNumber: 85,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "2f8a8a1f35e467578c986936eff493b9b875b067",
  },
  abilities: [],
  classifications: ["Dreamborn", "Villain", "Musketeer"],
};
