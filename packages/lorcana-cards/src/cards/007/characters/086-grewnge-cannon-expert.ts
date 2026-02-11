import type { CharacterCard } from "@tcg/lorcana-types";

export const grewngeCannonExpert: CharacterCard = {
  abilities: [
    {
      effect: {
        type: "play-card",
        from: "hand",
      },
      id: "15e-1",
      name: "RAPID FIRE",
      text: "RAPID FIRE Whenever this character quests, you pay 1 {I} less for the next action you play this turn.",
      trigger: {
        event: "quest",
        timing: "whenever",
        on: "SELF",
      },
      type: "triggered",
    },
  ],
  cardNumber: 86,
  cardType: "character",
  classifications: ["Storyborn", "Ally", "Pirate"],
  cost: 2,
  externalIds: {
    ravensburger: "953728c67c2d903d508f34dfca89bfb6c27fcbc2",
  },
  franchise: "Treasure Planet",
  fullName: "Grewnge - Cannon Expert",
  id: "15e",
  inkType: ["emerald"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Grewnge",
  set: "007",
  strength: 2,
  text: "RAPID FIRE Whenever this character quests, you pay 1 {I} less for the next action you play this turn.",
  version: "Cannon Expert",
  willpower: 2,
};
