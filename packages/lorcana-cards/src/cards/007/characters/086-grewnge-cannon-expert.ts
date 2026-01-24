import type { CharacterCard } from "@tcg/lorcana-types";

export const grewngeCannonExpert: CharacterCard = {
  id: "15e",
  cardType: "character",
  name: "Grewnge",
  version: "Cannon Expert",
  fullName: "Grewnge - Cannon Expert",
  inkType: ["emerald"],
  franchise: "Treasure Planet",
  set: "007",
  text: "RAPID FIRE Whenever this character quests, you pay 1 {I} less for the next action you play this turn.",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
  cardNumber: 86,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "953728c67c2d903d508f34dfca89bfb6c27fcbc2",
  },
  abilities: [
    {
      id: "15e-1",
      type: "triggered",
      name: "RAPID FIRE",
      trigger: {
        event: "quest",
        timing: "whenever",
        on: "SELF",
      },
      effect: {
        type: "play-card",
        from: "hand",
      },
      text: "RAPID FIRE Whenever this character quests, you pay 1 {I} less for the next action you play this turn.",
    },
  ],
  classifications: ["Storyborn", "Ally", "Pirate"],
};
