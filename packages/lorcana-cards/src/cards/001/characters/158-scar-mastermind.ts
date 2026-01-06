import type { CharacterCard } from "@tcg/lorcana-types";

export const scarMastermind: CharacterCard = {
  id: "1nb",
  cardType: "character",
  name: "Scar",
  version: "Mastermind",
  fullName: "Scar - Mastermind",
  inkType: ["sapphire"],
  franchise: "Lion King",
  set: "001",
  text: "INSIDIOUS PLOT When you play this character, chosen opposing character gets -5 {S} this turn.",
  cost: 6,
  strength: 5,
  willpower: 4,
  lore: 2,
  cardNumber: 158,
  inkable: true,
  externalIds: {
    ravensburger: "d58028e0439679ccda27077c066677d60f1cba4c",
  },
  abilities: [
    {
      id: "1nb-1",
      text: "INSIDIOUS PLOT When you play this character, chosen opposing character gets -5 {S} this turn.",
      name: "INSIDIOUS PLOT",
      type: "triggered",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: -5,
        target: "CHOSEN_OPPOSING_CHARACTER",
        duration: "this-turn",
      },
    },
  ],
  classifications: ["Storyborn", "Villain"],
};
