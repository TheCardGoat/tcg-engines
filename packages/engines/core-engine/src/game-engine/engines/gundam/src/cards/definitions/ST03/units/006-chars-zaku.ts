import type { GundamitoUnitCard } from "../../cardTypes";

const abilities: GundamitoUnitCard["abilities"] = [
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
        ruleText: "Zeon",
        originalText: "(Zeon)",
      },
      {
        type: "rule",
        ruleText: "Neo Zeon",
        originalText: "(Neo Zeon)",
      },
    ],
    trigger: {
      event: "destroyed",
    },
    text: "【destroyed】",
  },
];

export const charsZaku: GundamitoUnitCard = {
  id: "ST03-006",
  implemented: false,
  missingTestCase: true,
  cost: 2,
  level: 3,
  number: 6,
  name: "Char's Zaku Ⅱ",
  color: "green",
  set: "ST03",
  rarity: "legendary",
  imageUrl: "../images/cards/card/ST03-006.webp?250711",
  imgAlt: "Char's Zaku Ⅱ",
  type: "unit",
  zones: ["space", "earth"],
  traits: ["zeon"],
  linkRequirement: ["char aznable"],
  ap: 3,
  hp: 2,
  text: "【Destroyed】Look at the top 3 cards of your deck. You may reveal 1 (Zeon)/(Neo Zeon) Unit card among them and add it to your hand. Return the remaining cards randomly to the bottom of your deck.",
  abilities: abilities,
};
