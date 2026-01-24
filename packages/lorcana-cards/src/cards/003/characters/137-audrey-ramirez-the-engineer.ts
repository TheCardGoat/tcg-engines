import type { CharacterCard } from "@tcg/lorcana-types";

export const audreyRamirezTheEngineer: CharacterCard = {
  id: "csd",
  cardType: "character",
  name: "Audrey Ramirez",
  version: "The Engineer",
  fullName: "Audrey Ramirez - The Engineer",
  inkType: ["sapphire"],
  franchise: "Atlantis",
  set: "003",
  text: "Ward (Opponents can't choose this character except to challenge.)\nSPARE PARTS Whenever this character quests, ready one of your items.",
  cost: 5,
  strength: 2,
  willpower: 5,
  lore: 2,
  cardNumber: 137,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "2e16aefcc21576313bee509a1ee6d1b6a30a558a",
  },
  abilities: [
    {
      id: "csd-1",
      type: "keyword",
      keyword: "Ward",
      text: "Ward",
    },
    {
      id: "csd-2",
      type: "triggered",
      name: "SPARE PARTS",
      trigger: {
        event: "quest",
        timing: "whenever",
        on: "SELF",
      },
      effect: {
        type: "ready",
        target: {
          selector: "all",
          count: "all",
          owner: "you",
          zones: ["play"],
          cardTypes: ["item"],
        },
      },
      text: "SPARE PARTS Whenever this character quests, ready one of your items.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
};
