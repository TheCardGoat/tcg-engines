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
        type: "rule",
        ruleText: "ZAFT",
        originalText: "(ZAFT)",
      },
    ],
    trigger: {
      event: "when-paired",
    },
    text: "【when paired】",
  },
];

export const duelGundamAssaultShroud: GundamitoUnitCard = {
  id: "GD01-045",
  implemented: false,
  missingTestCase: true,
  cost: 4,
  level: 5,
  number: 45,
  name: "Duel Gundam (Assault Shroud)",
  color: "red",
  set: "GD01",
  rarity: "legendary",
  imageUrl: "../images/cards/card/GD01-045.webp?250711",
  imgAlt: "Duel Gundam (Assault Shroud)",
  type: "unit",
  zones: ["space", "earth"],
  traits: [],
  linkRequirement: ["yzak jule"],
  ap: 4,
  hp: 4,
  text: "【When Paired】Look at the top 3 cards of your deck. You may deploy 1 (ZAFT) Unit card that is Lv.4 or lower among them. Return the remaining cards randomly to the bottom of your deck.",
  abilities: abilities,
};
