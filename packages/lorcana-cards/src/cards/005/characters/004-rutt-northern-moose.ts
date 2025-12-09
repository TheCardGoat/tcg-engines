import type { CharacterCard } from "@tcg/lorcana";

export const ruttNorthernMoose: CharacterCard = {
  id: "sqf",
  cardType: "character",
  name: "Rutt",
  version: "Northern Moose",
  fullName: "Rutt - Northern Moose",
  inkType: ["amber"],
  franchise: "Brother Bear",
  set: "005",
  text: "Support (Whenever this character quests, you may add their to another chosen character's this turn.)",
  cost: 4,
  strength: 3,
  willpower: 4,
  lore: 1,
  cardNumber: 4,
  inkable: true,
  externalIds: {
    ravensburger: "678f68c55dfedbbaffb7e07321b6342581a6b658",
  },
  keywords: ["Support"],
  abilities: [
    {
      id: "sqf-1",
      text: "Support",
      type: "keyword",
      keyword: "Support",
    },
  ],
  classifications: ["Storyborn", "Ally"],
};
