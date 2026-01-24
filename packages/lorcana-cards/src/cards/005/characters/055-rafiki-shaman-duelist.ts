import type { CharacterCard } from "@tcg/lorcana-types";

export const rafikiShamanDuelist: CharacterCard = {
  id: "v9e",
  cardType: "character",
  name: "Rafiki",
  version: "Shaman Duelist",
  fullName: "Rafiki - Shaman Duelist",
  inkType: ["amethyst"],
  franchise: "Lion King",
  set: "005",
  text: "Rush (This character can challenge the turn they're played.)\nSURPRISING SKILL When you play this character, he gains Challenger +4 this turn. (They get +4 {S} while challenging.)",
  cost: 4,
  strength: 1,
  willpower: 4,
  lore: 2,
  cardNumber: 55,
  inkable: false,
  missingTests: true,
  externalIds: {
    ravensburger: "70ab2b3db6ba7f1aa4c0f7653eb7a3b4f9427c94",
  },
  abilities: [
    {
      id: "v9e-1",
      type: "keyword",
      keyword: "Rush",
      text: "Rush",
    },
    {
      id: "v9e-2",
      type: "triggered",
      name: "SURPRISING SKILL",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "gain-keyword",
        keyword: "Challenger",
        target: "CHOSEN_CHARACTER",
        value: 4,
        duration: "this-turn",
      },
      text: "SURPRISING SKILL When you play this character, he gains Challenger +4 this turn.",
    },
  ],
  classifications: ["Storyborn", "Mentor", "Sorcerer"],
};
