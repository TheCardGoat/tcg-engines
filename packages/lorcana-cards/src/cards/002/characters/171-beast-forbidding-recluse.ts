import type { CharacterCard } from "@tcg/lorcana-types";

export const beastForbiddingRecluse: CharacterCard = {
  id: "682",
  cardType: "character",
  name: "Beast",
  version: "Forbidding Recluse",
  fullName: "Beast - Forbidding Recluse",
  inkType: ["steel"],
  franchise: "Beauty and the Beast",
  set: "002",
  text: "YOU'RE NOT WELCOME HERE When you play this character, you may deal 1 damage to chosen character.",
  cost: 4,
  strength: 3,
  willpower: 4,
  lore: 1,
  cardNumber: 171,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "166eafad1d590ff957396077a5bee751b022c264",
  },
  abilities: [
    {
      id: "682-1",
      type: "triggered",
      name: "YOU'RE NOT WELCOME HERE",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "optional",
        effect: {
          type: "deal-damage",
          amount: 1,
          target: {
            selector: "chosen",
            count: 1,
            owner: "any",
            zones: ["play"],
            cardTypes: ["character"],
          },
        },
        chooser: "CONTROLLER",
      },
      text: "YOU'RE NOT WELCOME HERE When you play this character, you may deal 1 damage to chosen character.",
    },
  ],
  classifications: ["Dreamborn", "Hero", "Prince"],
};
