import type { CharacterCard } from "@tcg/lorcana-types";

export const PascalRapunzelsCompanion: CharacterCard = {
  id: "1f9",
  cardType: "character",
  name: "Pascal",
  version: "Rapunzel’s Companion",
  fullName: "Pascal - Rapunzel’s Companion",
  inkType: ["amethyst"],
  franchise: "Tangled",
  set: "001",
  text: "CAMOUFLAGE While you have another character in play, this character gains Evasive. (Only characters with Evasive can challenge them.)",
  cost: 1,
  strength: 1,
  willpower: 1,
  lore: 1,
  cardNumber: 53,
  inkable: true,
  externalIds: {
    ravensburger: "b814a14e2ffdfc65f2f3431f069419dede125422",
  },
  abilities: [
    {
      id: "1f9-1",
      text: "CAMOUFLAGE While you have another character in play, this character gains Evasive.",
      name: "CAMOUFLAGE",
      type: "static",
      effect: {
        type: "gain-keyword",
        keyword: "Evasive",
        target: "SELF",
        duration: "this-turn",
      },
    },
  ],
  classifications: ["Storyborn", "Ally"],
};
