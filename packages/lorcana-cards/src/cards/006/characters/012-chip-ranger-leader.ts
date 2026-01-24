import type { CharacterCard } from "@tcg/lorcana-types";

export const chipRangerLeader: CharacterCard = {
  id: "1ue",
  cardType: "character",
  name: "Chip",
  version: "Ranger Leader",
  fullName: "Chip - Ranger Leader",
  inkType: ["amber"],
  franchise: "Rescue Rangers",
  set: "006",
  text: "THE VALUE OF FRIENDSHIP While you have a character named Dale in play, this character gains Support. (Whenever they quest, you may add their {S} to another chosen character's {S} this turn.)",
  cost: 4,
  strength: 3,
  willpower: 4,
  lore: 2,
  cardNumber: 12,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "ef51cbc17715fb350e0780b289c630d1a5e5a916",
  },
  abilities: [
    {
      id: "1ue-1",
      type: "action",
      effect: {
        type: "gain-keyword",
        keyword: "Support",
        target: "SELF",
      },
      text: "THE VALUE OF FRIENDSHIP While you have a character named Dale in play, this character gains Support.",
    },
  ],
  classifications: ["Storyborn", "Hero"],
};
