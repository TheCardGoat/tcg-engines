import type { CharacterCard } from "@tcg/lorcana-types";

export const hueySavvyNephew: CharacterCard = {
  id: "aka",
  cardType: "character",
  name: "Huey",
  version: "Savvy Nephew",
  fullName: "Huey - Savvy Nephew",
  inkType: ["sapphire"],
  franchise: "Ducktales",
  set: "009",
  text: "Support (Whenever this character quests, you may add their {S} to another chosen character’s {S} this turn.)\nTHREE NEPHEWS Whenever this character quests, if you have characters named Dewey and Louie in play, you may draw 3 cards.",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
  cardNumber: 138,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "2612c4d73c23b6a316f7b372373164a6be833e87",
  },
  abilities: [
    {
      id: "aka-1",
      type: "keyword",
      keyword: "Support",
      text: "Support",
    },
    {
      id: "aka-2",
      type: "triggered",
      name: "THREE NEPHEWS",
      trigger: {
        event: "quest",
        timing: "whenever",
        on: "SELF",
      },
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
      text: "THREE NEPHEWS Whenever this character quests, if you have characters named Dewey and Louie in play, you may draw 3 cards.",
    },
  ],
  classifications: ["Dreamborn", "Ally"],
};
