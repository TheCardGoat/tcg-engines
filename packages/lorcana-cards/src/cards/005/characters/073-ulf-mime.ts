import type { CharacterCard } from "@tcg/lorcana-types";

export const ulfMime: CharacterCard = {
  id: "111",
  cardType: "character",
  name: "Ulf",
  version: "Mime",
  fullName: "Ulf - Mime",
  inkType: ["emerald"],
  franchise: "Tangled",
  set: "005",
  text: "SILENT PERFORMANCE This character can't {E} to sing songs.",
  cost: 4,
  strength: 4,
  willpower: 3,
  lore: 2,
  cardNumber: 73,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "85817c98f4f43a007a486a14f7afd0a47aeec8a4",
  },
  abilities: [
    {
      id: "111-1",
      type: "static",
      effect: {
        type: "restriction",
        restriction: "cant-sing",
        target: "SELF",
      },
      name: "SILENT PERFORMANCE",
      text: "SILENT PERFORMANCE This character can't {E} to sing songs.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
};
