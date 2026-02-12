import type { CharacterCard } from "@tcg/lorcana-types";

export const chipRangerLeader: CharacterCard = {
  abilities: [
    {
      effect: {
        type: "gain-keyword",
        keyword: "Support",
        target: "SELF",
      },
      id: "1ue-1",
      text: "THE VALUE OF FRIENDSHIP While you have a character named Dale in play, this character gains Support.",
      type: "action",
    },
  ],
  cardNumber: 12,
  cardType: "character",
  classifications: ["Storyborn", "Hero"],
  cost: 4,
  externalIds: {
    ravensburger: "ef51cbc17715fb350e0780b289c630d1a5e5a916",
  },
  franchise: "Rescue Rangers",
  fullName: "Chip - Ranger Leader",
  id: "1ue",
  inkType: ["amber"],
  inkable: true,
  lore: 2,
  missingTests: true,
  name: "Chip",
  set: "006",
  strength: 3,
  text: "THE VALUE OF FRIENDSHIP While you have a character named Dale in play, this character gains Support. (Whenever they quest, you may add their {S} to another chosen character's {S} this turn.)",
  version: "Ranger Leader",
  willpower: 4,
};
