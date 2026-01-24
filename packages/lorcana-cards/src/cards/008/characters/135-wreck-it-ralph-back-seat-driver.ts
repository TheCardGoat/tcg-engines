import type { CharacterCard } from "@tcg/lorcana-types";

export const wreckitRalphBackSeatDriver: CharacterCard = {
  id: "1ce",
  cardType: "character",
  name: "Wreck-It Ralph",
  version: "Back Seat Driver",
  fullName: "Wreck-It Ralph - Back Seat Driver",
  inkType: ["ruby"],
  franchise: "Wreck It Ralph",
  set: "008",
  text: "CHARGED UP When you play this character, chosen Racer character gets +4 {S} this turn.",
  cost: 3,
  strength: 4,
  willpower: 2,
  lore: 1,
  cardNumber: 135,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "ae782ba1f03c05a7094ed54d408df2ffaf9627ec",
  },
  abilities: [
    {
      id: "1ce-1",
      type: "triggered",
      name: "CHARGED UP",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: 4,
        target: "CHOSEN_CHARACTER",
        duration: "this-turn",
      },
      text: "CHARGED UP When you play this character, chosen Racer character gets +4 {S} this turn.",
    },
  ],
  classifications: ["Storyborn", "Hero", "Racer"],
};
