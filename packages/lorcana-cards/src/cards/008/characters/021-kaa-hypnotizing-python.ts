import type { CharacterCard } from "@tcg/lorcana-types";

export const kaaHypnotizingPython: CharacterCard = {
  id: "1v1",
  cardType: "character",
  name: "Kaa",
  version: "Hypnotizing Python",
  fullName: "Kaa - Hypnotizing Python",
  inkType: ["amber", "emerald"],
  franchise: "Jungle Book",
  set: "008",
  text: "LOOK ME IN THE EYE Whenever this character quests, chosen opposing character gets -2 {S} and gains Reckless until the start of your next turn. (They can't quest and must challenge if able.)",
  cost: 4,
  strength: 3,
  willpower: 3,
  lore: 2,
  cardNumber: 21,
  inkable: false,
  missingTests: true,
  externalIds: {
    ravensburger: "f282a36bea0b86730827e7de3e6e6879a13d9171",
  },
  abilities: [
    {
      id: "1v1-1",
      type: "triggered",
      name: "LOOK ME IN THE EYE",
      trigger: {
        event: "quest",
        timing: "whenever",
        on: "SELF",
      },
      effect: {
        type: "sequence",
        steps: [
          {
            type: "modify-stat",
            stat: "strength",
            modifier: -2,
            target: "CHOSEN_CHARACTER",
          },
          {
            type: "gain-keyword",
            keyword: "Reckless",
            target: "SELF",
          },
        ],
      },
      text: "LOOK ME IN THE EYE Whenever this character quests, chosen opposing character gets -2 {S} and gains Reckless until the start of your next turn.",
    },
  ],
  classifications: ["Storyborn", "Villain"],
};
