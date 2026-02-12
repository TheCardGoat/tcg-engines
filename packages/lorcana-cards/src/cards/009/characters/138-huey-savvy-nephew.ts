import type { CharacterCard } from "@tcg/lorcana-types";

export const hueySavvyNephew: CharacterCard = {
  abilities: [
    {
      id: "aka-1",
      keyword: "Support",
      text: "Support",
      type: "keyword",
    },
    {
      effect: {
        type: "conditional",
        condition: {
          type: "if",
          expression: "you have characters named Dewey and Louie in play",
        },
        then: {
          type: "draw",
          amount: 3,
          target: "CONTROLLER",
        },
      },
      id: "aka-2",
      name: "THREE NEPHEWS",
      text: "THREE NEPHEWS Whenever this character quests, if you have characters named Dewey and Louie in play, you may draw 3 cards.",
      trigger: {
        event: "quest",
        timing: "whenever",
        on: "SELF",
      },
      type: "triggered",
    },
  ],
  cardNumber: 138,
  cardType: "character",
  classifications: ["Dreamborn", "Ally"],
  cost: 2,
  externalIds: {
    ravensburger: "2612c4d73c23b6a316f7b372373164a6be833e87",
  },
  franchise: "Ducktales",
  fullName: "Huey - Savvy Nephew",
  id: "aka",
  inkType: ["sapphire"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Huey",
  set: "009",
  strength: 2,
  text: "Support (Whenever this character quests, you may add their {S} to another chosen character’s {S} this turn.)\nTHREE NEPHEWS Whenever this character quests, if you have characters named Dewey and Louie in play, you may draw 3 cards.",
  version: "Savvy Nephew",
  willpower: 2,
};
