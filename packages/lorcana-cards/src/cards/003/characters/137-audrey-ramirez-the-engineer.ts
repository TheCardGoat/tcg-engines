import type { CharacterCard } from "@tcg/lorcana-types";

export const audreyRamirezTheEngineer: CharacterCard = {
  abilities: [
    {
      id: "csd-1",
      keyword: "Ward",
      text: "Ward",
      type: "keyword",
    },
    {
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
      id: "csd-2",
      name: "SPARE PARTS",
      text: "SPARE PARTS Whenever this character quests, ready one of your items.",
      trigger: {
        event: "quest",
        timing: "whenever",
        on: "SELF",
      },
      type: "triggered",
    },
  ],
  cardNumber: 137,
  cardType: "character",
  classifications: ["Storyborn", "Ally"],
  cost: 5,
  externalIds: {
    ravensburger: "2e16aefcc21576313bee509a1ee6d1b6a30a558a",
  },
  franchise: "Atlantis",
  fullName: "Audrey Ramirez - The Engineer",
  id: "csd",
  inkType: ["sapphire"],
  inkable: true,
  lore: 2,
  missingTests: true,
  name: "Audrey Ramirez",
  set: "003",
  strength: 2,
  text: "Ward (Opponents can't choose this character except to challenge.)\nSPARE PARTS Whenever this character quests, ready one of your items.",
  version: "The Engineer",
  willpower: 5,
};
