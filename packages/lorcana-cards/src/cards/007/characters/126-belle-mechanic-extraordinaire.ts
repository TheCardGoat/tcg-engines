import type { CharacterCard } from "@tcg/lorcana-types";

export const belleMechanicExtraordinaire: CharacterCard = {
  id: "lej",
  cardType: "character",
  name: "Belle",
  version: "Mechanic Extraordinaire",
  fullName: "Belle - Mechanic Extraordinaire",
  inkType: ["ruby", "sapphire"],
  franchise: "Beauty and the Beast",
  set: "007",
  text: "Shift 7\nSALVAGE For each item card in your discard, you pay 1 {I} less to play this character using her Shift ability.\nREPURPOSE Whenever this character quests, you may put up to 3 item cards from your discard on the bottom of your deck to gain 1 lore for each item card moved this way.",
  cost: 9,
  strength: 7,
  willpower: 7,
  lore: 3,
  cardNumber: 126,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "4d23f100a066fd4f3e2360075ccf1959f705f5d7",
  },
  abilities: [],
  classifications: ["Floodborn", "Hero", "Princess", "Inventor"],
};
