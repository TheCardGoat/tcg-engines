import type { CharacterCard } from "@tcg/lorcana-types";

export const mufasaRulerOfPrideRock: CharacterCard = {
  abilities: [
    {
      effect: {
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
        type: "sequence",
      },
      id: "163-1",
      name: "A DELICATE BALANCE",
      text: "A DELICATE BALANCE When you play this character, exert all cards in your inkwell, then return 2 cards at random from your inkwell to your hand.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
    {
      effect: {
        target: {
          selector: "all",
          count: "all",
          owner: "any",
          zones: ["play"],
          cardTypes: ["card"],
        },
        type: "ready",
      },
      id: "163-2",
      name: "EVERYTHING THE LIGHT TOUCHES",
      text: "EVERYTHING THE LIGHT TOUCHES Whenever this character quests, ready all cards in your inkwell.",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  cardNumber: 150,
  cardType: "character",
  classifications: ["Storyborn", "Mentor", "King"],
  cost: 8,
  externalIds: {
    ravensburger: "97ba44b060278c8f2f5f75a9a77b64ea977369c1",
  },
  franchise: "Lion King",
  fullName: "Mufasa - Ruler of Pride Rock",
  id: "163",
  inkType: ["sapphire"],
  inkable: false,
  lore: 4,
  missingTests: true,
  name: "Mufasa",
  set: "005",
  strength: 4,
  text: "A DELICATE BALANCE When you play this character, exert all cards in your inkwell, then return 2 cards at random from your inkwell to your hand.\nEVERYTHING THE LIGHT TOUCHES Whenever this character quests, ready all cards in your inkwell.",
  version: "Ruler of Pride Rock",
  willpower: 9,
};
