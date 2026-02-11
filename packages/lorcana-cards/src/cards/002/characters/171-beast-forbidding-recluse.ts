import type { CharacterCard } from "@tcg/lorcana-types";

export const beastForbiddingRecluse: CharacterCard = {
  abilities: [
    {
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
      id: "682-1",
      name: "YOU'RE NOT WELCOME HERE",
      text: "YOU'RE NOT WELCOME HERE When you play this character, you may deal 1 damage to chosen character.",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      type: "triggered",
    },
  ],
  cardNumber: 171,
  cardType: "character",
  classifications: ["Dreamborn", "Hero", "Prince"],
  cost: 4,
  externalIds: {
    ravensburger: "166eafad1d590ff957396077a5bee751b022c264",
  },
  franchise: "Beauty and the Beast",
  fullName: "Beast - Forbidding Recluse",
  id: "682",
  inkType: ["steel"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Beast",
  set: "002",
  strength: 3,
  text: "YOU'RE NOT WELCOME HERE When you play this character, you may deal 1 damage to chosen character.",
  version: "Forbidding Recluse",
  willpower: 4,
};
