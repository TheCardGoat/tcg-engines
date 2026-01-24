import type { CharacterCard } from "@tcg/lorcana-types";

export const mufasaRulerOfPrideRock: CharacterCard = {
  id: "163",
  cardType: "character",
  name: "Mufasa",
  version: "Ruler of Pride Rock",
  fullName: "Mufasa - Ruler of Pride Rock",
  inkType: ["sapphire"],
  franchise: "Lion King",
  set: "005",
  text: "A DELICATE BALANCE When you play this character, exert all cards in your inkwell, then return 2 cards at random from your inkwell to your hand.\nEVERYTHING THE LIGHT TOUCHES Whenever this character quests, ready all cards in your inkwell.",
  cost: 8,
  strength: 4,
  willpower: 9,
  lore: 4,
  cardNumber: 150,
  inkable: false,
  missingTests: true,
  externalIds: {
    ravensburger: "97ba44b060278c8f2f5f75a9a77b64ea977369c1",
  },
  abilities: [
    {
      id: "163-1",
      type: "triggered",
      name: "A DELICATE BALANCE",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "sequence",
        steps: [
          {
            type: "exert",
            target: {
              selector: "all",
              count: "all",
              owner: "any",
              zones: ["play"],
              cardTypes: ["card"],
            },
          },
          {
            type: "return-to-hand",
            target: {
              selector: "chosen",
              count: 1,
              owner: "any",
              zones: ["play"],
              cardTypes: ["card"],
            },
          },
        ],
      },
      text: "A DELICATE BALANCE When you play this character, exert all cards in your inkwell, then return 2 cards at random from your inkwell to your hand.",
    },
    {
      id: "163-2",
      type: "triggered",
      name: "EVERYTHING THE LIGHT TOUCHES",
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
          owner: "any",
          zones: ["play"],
          cardTypes: ["card"],
        },
      },
      text: "EVERYTHING THE LIGHT TOUCHES Whenever this character quests, ready all cards in your inkwell.",
    },
  ],
  classifications: ["Storyborn", "Mentor", "King"],
};
