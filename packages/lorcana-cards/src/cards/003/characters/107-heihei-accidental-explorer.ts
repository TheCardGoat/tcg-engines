import type { CharacterCard } from "@tcg/lorcana-types";

export const heiheiAccidentalExplorer: CharacterCard = {
  abilities: [
    {
      effect: {
        type: "lose-lore",
        amount: 1,
        target: "EACH_OPPONENT",
      },
      id: "j8v-1",
      name: "MINDLESS WANDERING",
      text: "MINDLESS WANDERING Once per turn, when this character moves to a location, each opponent loses 1 lore.",
      trigger: { event: "play", timing: "when", on: "SELF" },
      type: "triggered",
    },
  ],
  cardNumber: 107,
  cardType: "character",
  classifications: ["Storyborn", "Ally"],
  cost: 2,
  externalIds: {
    ravensburger: "455defcf78009f1d2942d2ea1cc9a69334c1b7ff",
  },
  franchise: "Moana",
  fullName: "HeiHei - Accidental Explorer",
  id: "j8v",
  inkType: ["ruby"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "HeiHei",
  set: "003",
  strength: 3,
  text: "MINDLESS WANDERING Once per turn, when this character moves to a location, each opponent loses 1 lore.",
  version: "Accidental Explorer",
  willpower: 2,
};
