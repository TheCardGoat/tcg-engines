import type { CharacterCard } from "@tcg/lorcana-types";

export const edHystericalPartygoer: CharacterCard = {
  abilities: [
    {
      effect: {
        restriction: "cant-challenge",
        target: "SELF",
        type: "restriction",
      },
      id: "q6u-1",
      text: "ROWDY GUEST Damaged characters can't challenge this character.",
      type: "static",
    },
  ],
  cardNumber: 81,
  cardType: "character",
  classifications: ["Storyborn", "Ally", "Hyena"],
  cost: 4,
  externalIds: {
    ravensburger: "5e6406aaa374d7b2bc273392407785819a729b39",
  },
  franchise: "Lion King",
  fullName: "Ed - Hysterical Partygoer",
  id: "q6u",
  inkType: ["emerald"],
  inkable: false,
  lore: 3,
  missingTests: true,
  name: "Ed",
  set: "005",
  strength: 2,
  text: "ROWDY GUEST Damaged characters can't challenge this character.",
  version: "Hysterical Partygoer",
  willpower: 4,
};
