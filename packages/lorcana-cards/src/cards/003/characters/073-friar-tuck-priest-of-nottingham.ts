import type { CharacterCard } from "@tcg/lorcana-types";

export const friarTuckPriestOfNottingham: CharacterCard = {
  abilities: [
    {
      effect: {
        amount: 1,
        chosen: true,
        target: "CONTROLLER",
        type: "discard",
      },
      id: "f7m-1",
      name: "YOU THIEVING SCOUNDREL",
      text: "YOU THIEVING SCOUNDREL When you play this character, the player or players with the most cards in their hand chooses and discards a card.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  cardNumber: 73,
  cardType: "character",
  classifications: ["Storyborn", "Ally"],
  cost: 4,
  externalIds: {
    ravensburger: "36d317eaeebe671e69cbcdf9e312cd7ae4db6a4d",
  },
  franchise: "Robin Hood",
  fullName: "Friar Tuck - Priest of Nottingham",
  id: "f7m",
  inkType: ["emerald"],
  inkable: true,
  lore: 2,
  missingTests: true,
  name: "Friar Tuck",
  set: "003",
  strength: 2,
  text: "YOU THIEVING SCOUNDREL When you play this character, the player or players with the most cards in their hand chooses and discards a card.",
  version: "Priest of Nottingham",
  willpower: 4,
};
