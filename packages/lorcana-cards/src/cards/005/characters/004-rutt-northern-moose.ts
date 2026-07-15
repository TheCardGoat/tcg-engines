import type { CharacterCard } from "@tcg/lorcana-types";

export const ruttNorthernMoose: CharacterCard = {
  abilities: [
    {
      id: "sqf-1",
      keyword: "Support",
      text: "Support",
      type: "keyword",
    },
  ],
  cardNumber: 4,
  cardType: "character",
  classifications: ["Storyborn", "Ally"],
  cost: 4,
  externalIds: {
    ravensburger: "678f68c55dfedbbaffb7e07321b6342581a6b658",
  },
  franchise: "Brother Bear",
  fullName: "Rutt - Northern Moose",
  id: "sqf",
  inkType: ["amber"],
  inkable: true,
  lore: 1,
  name: "Rutt",
  set: "005",
  strength: 3,
  text: "Support (Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.)",
  version: "Northern Moose",
  willpower: 4,
};
