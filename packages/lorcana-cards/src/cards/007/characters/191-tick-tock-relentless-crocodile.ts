import type { CharacterCard } from "@tcg/lorcana-types";

export const ticktockRelentlessCrocodile: CharacterCard = {
  abilities: [
    {
      effect: {
        keyword: "Evasive",
        target: "SELF",
        type: "gain-keyword",
      },
      id: "1qn-1",
      text: "LOOKING FOR LUNCH During your turn, this character gains Evasive while a Pirate character is in play.",
      type: "action",
    },
  ],
  cardNumber: 191,
  cardType: "character",
  classifications: ["Storyborn"],
  cost: 5,
  externalIds: {
    ravensburger: "e1cc4fc2b8f3553070493043ebc236022311ddc9",
  },
  franchise: "Peter Pan",
  fullName: "Tick-Tock - Relentless Crocodile",
  id: "1qn",
  inkType: ["steel"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Tick-Tock",
  set: "007",
  strength: 5,
  text: "LOOKING FOR LUNCH During your turn, this character gains Evasive while a Pirate character is in play. (They can challenge characters with Evasive.)",
  version: "Relentless Crocodile",
  willpower: 6,
};
