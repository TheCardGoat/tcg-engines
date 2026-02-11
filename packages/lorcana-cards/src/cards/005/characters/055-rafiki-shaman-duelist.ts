import type { CharacterCard } from "@tcg/lorcana-types";

export const rafikiShamanDuelist: CharacterCard = {
  abilities: [
    {
      id: "v9e-1",
      keyword: "Rush",
      text: "Rush",
      type: "keyword",
    },
    {
      effect: {
        type: "gain-keyword",
        keyword: "Challenger",
        target: "CHOSEN_CHARACTER",
        value: 4,
        duration: "this-turn",
      },
      id: "v9e-2",
      name: "SURPRISING SKILL",
      text: "SURPRISING SKILL When you play this character, he gains Challenger +4 this turn.",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      type: "triggered",
    },
  ],
  cardNumber: 55,
  cardType: "character",
  classifications: ["Storyborn", "Mentor", "Sorcerer"],
  cost: 4,
  externalIds: {
    ravensburger: "70ab2b3db6ba7f1aa4c0f7653eb7a3b4f9427c94",
  },
  franchise: "Lion King",
  fullName: "Rafiki - Shaman Duelist",
  id: "v9e",
  inkType: ["amethyst"],
  inkable: false,
  lore: 2,
  missingTests: true,
  name: "Rafiki",
  set: "005",
  strength: 1,
  text: "Rush (This character can challenge the turn they're played.)\nSURPRISING SKILL When you play this character, he gains Challenger +4 this turn. (They get +4 {S} while challenging.)",
  version: "Shaman Duelist",
  willpower: 4,
};
