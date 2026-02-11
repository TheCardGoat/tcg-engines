import type { CharacterCard } from "@tcg/lorcana-types";

export const wreckitRalphBackSeatDriver: CharacterCard = {
  abilities: [
    {
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: 4,
        target: "CHOSEN_CHARACTER",
        duration: "this-turn",
      },
      id: "1ce-1",
      name: "CHARGED UP",
      text: "CHARGED UP When you play this character, chosen Racer character gets +4 {S} this turn.",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      type: "triggered",
    },
  ],
  cardNumber: 135,
  cardType: "character",
  classifications: ["Storyborn", "Hero", "Racer"],
  cost: 3,
  externalIds: {
    ravensburger: "ae782ba1f03c05a7094ed54d408df2ffaf9627ec",
  },
  franchise: "Wreck It Ralph",
  fullName: "Wreck-It Ralph - Back Seat Driver",
  id: "1ce",
  inkType: ["ruby"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Wreck-It Ralph",
  set: "008",
  strength: 4,
  text: "CHARGED UP When you play this character, chosen Racer character gets +4 {S} this turn.",
  version: "Back Seat Driver",
  willpower: 2,
};
