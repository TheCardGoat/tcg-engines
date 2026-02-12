import type { CharacterCard } from "@tcg/lorcana-types";

export const elsaExploringTheUnknown: CharacterCard = {
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          amount: 1,
          target: "CONTROLLER",
          type: "draw",
        },
        type: "optional",
      },
      id: "744-1",
      name: "CLOSER LOOK",
      text: "CLOSER LOOK When you play this character, you may draw a card.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  cardNumber: 45,
  cardType: "character",
  classifications: ["Dreamborn", "Hero", "Queen", "Sorcerer"],
  cost: 3,
  externalIds: {
    ravensburger: "19a46ebcde9538732365e630c3cd5a56fd6ec603",
  },
  franchise: "Frozen",
  fullName: "Elsa - Exploring the Unknown",
  id: "744",
  inkType: ["amethyst"],
  inkable: true,
  lore: 1,
  name: "Elsa",
  set: "010",
  strength: 1,
  text: "CLOSER LOOK When you play this character, you may draw a card.",
  version: "Exploring the Unknown",
  willpower: 3,
};
