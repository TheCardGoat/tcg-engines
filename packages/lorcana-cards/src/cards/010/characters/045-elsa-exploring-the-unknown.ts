import type { CharacterCard } from "@tcg/lorcana-types";

export const elsaExploringTheUnknown: CharacterCard = {
  id: "744",
  cardType: "character",
  name: "Elsa",
  version: "Exploring the Unknown",
  fullName: "Elsa - Exploring the Unknown",
  inkType: ["amethyst"],
  franchise: "Frozen",
  set: "010",
  text: "CLOSER LOOK When you play this character, you may draw a card.",
  cost: 3,
  strength: 1,
  willpower: 3,
  lore: 1,
  cardNumber: 45,
  inkable: true,
  externalIds: {
    ravensburger: "19a46ebcde9538732365e630c3cd5a56fd6ec603",
  },
  abilities: [
    {
      id: "744-1",
      name: "CLOSER LOOK",
      type: "triggered",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "optional",
        effect: {
          type: "draw",
          amount: 1,
          target: "CONTROLLER",
        },
        chooser: "CONTROLLER",
      },
    },
  ],
  classifications: ["Dreamborn", "Hero", "Queen", "Sorcerer"],
};
