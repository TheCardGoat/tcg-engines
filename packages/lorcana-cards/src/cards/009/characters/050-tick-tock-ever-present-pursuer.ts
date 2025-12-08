import type { CharacterCard } from "@tcg/lorcana";

export const ticktockEverpresentPursuer: CharacterCard = {
  id: "16h",
  cardType: "character",
  name: "Tick-Tock",
  version: "Ever-Present Pursuer",
  fullName: "Tick-Tock - Ever-Present Pursuer",
  inkType: ["amethyst"],
  franchise: "Peter Pan",
  set: "009",
  text: "Evasive (Only characters with Evasive can challenge this character.)",
  cardNumber: "050",
  cost: 6,
  strength: 4,
  willpower: 7,
  lore: 1,
  inkable: true,
  externalIds: {
    ravensburger: "99133bb34b1ce309fdf855a65f0cd70f9a17cc59",
  },
  keywords: ["Evasive"],
  abilities: [
    {
      id: "16h-1",
      text: "Evasive",
      type: "keyword",
      keyword: "Evasive",
    },
  ],
  classifications: ["Storyborn", "Ally"],
};
