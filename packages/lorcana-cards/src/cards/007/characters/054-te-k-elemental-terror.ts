import type { CharacterCard } from "@tcg/lorcana-types";

export const teKElementalTerror: CharacterCard = {
  abilities: [
    {
      cost: {
        ink: 7,
      },
      id: "1od-1",
      keyword: "Shift",
      text: "Shift 7",
      type: "keyword",
    },
  ],
  cardNumber: 54,
  cardType: "character",
  classifications: ["Floodborn", "Villain", "Deity"],
  cost: 10,
  externalIds: {
    ravensburger: "060b34992cdf3b51d872b1f70f9d808ba0b3be9a",
  },
  franchise: "Moana",
  fullName: "Te Kā - Elemental Terror",
  id: "1od",
  inkType: ["amethyst", "ruby"],
  inkable: true,
  lore: 3,
  missingImplementation: true,
  missingTests: true,
  name: "Te Kā",
  set: "007",
  strength: 12,
  text: "Shift 7 (You may pay 7 {I} to play this on top of one of your characters named Te Kā.)\nANCIENT RAGE During your turn, whenever an opposing character is exerted, banish them.",
  version: "Elemental Terror",
  willpower: 12,
};
