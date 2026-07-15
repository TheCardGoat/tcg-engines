import type { CharacterCard } from "@tcg/lorcana-types";

export const ulfMime: CharacterCard = {
  abilities: [
    {
      effect: {
        restriction: "cant-sing",
        target: "SELF",
        type: "restriction",
      },
      id: "111-1",
      name: "SILENT PERFORMANCE",
      text: "SILENT PERFORMANCE This character can't {E} to sing songs.",
      type: "static",
    },
  ],
  cardNumber: 73,
  cardType: "character",
  classifications: ["Storyborn", "Ally"],
  cost: 4,
  externalIds: {
    ravensburger: "85817c98f4f43a007a486a14f7afd0a47aeec8a4",
  },
  franchise: "Tangled",
  fullName: "Ulf - Mime",
  id: "111",
  inkType: ["emerald"],
  inkable: true,
  lore: 2,
  missingTests: true,
  name: "Ulf",
  set: "005",
  strength: 4,
  text: "SILENT PERFORMANCE This character can't {E} to sing songs.",
  version: "Mime",
  willpower: 3,
};
