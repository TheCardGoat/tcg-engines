import type { GundamitoCommandCard } from "../../cardTypes";

const abilities: GundamitoCommandCard["abilities"] = [
  {
    type: "triggered",
    effects: [
      {
        type: "search",
        target: {
          type: "zone",
          value: "deck",
          filters: [],
        },
        amount: 1,
        searchType: "look",
      },
      {
        type: "move-to-hand",
        target: {
          type: "unit",
          value: "self",
          filters: [],
        },
        targetText: "it",
        originalText: "add it to your hand",
      },
      {
        type: "rule",
        ruleText: "Operation Meteor",
        originalText: "(Operation Meteor)",
      },
      {
        type: "rule",
        ruleText: "G Team",
        originalText: "(G Team)",
      },
    ],
    trigger: {
      event: "main",
    },
    text: "【main】",
  },
];

export const thePathToVictoryOrDefeat: GundamitoCommandCard = {
  id: "GD01-109",
  implemented: false,
  missingTestCase: true,
  cost: 1,
  level: 5,
  number: 109,
  name: "The Path to Victory or Defeat",
  color: "green",
  set: "GD01",
  rarity: "common",
  imageUrl: "../images/cards/card/GD01-109.webp?250711",
  imgAlt: "The Path to Victory or Defeat",
  type: "command",
  text: "【Main】Look at the top 5 cards of your deck. You may reveal 1 (Operation Meteor)/(G Team) Unit card/Pilot card among them and add it to your hand. Return the remaining cards randomly to the bottom of your deck.",
  abilities: abilities,
};
