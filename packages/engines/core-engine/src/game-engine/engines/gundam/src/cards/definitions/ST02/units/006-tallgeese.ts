import type { GundamitoUnitCard } from "../../cardTypes";

const abilities: GundamitoUnitCard["abilities"] = [
  {
    type: "triggered",
    effects: [
      {
        type: "placeholder",
        parameters: {},
      },
    ],
    trigger: {
      event: "activate･main",
    },
    text: "【Activate･Main】",
  },
  {
    type: "triggered",
    effects: [
      {
        type: "placeholder",
        parameters: {},
      },
    ],
    trigger: {
      event: "once-per-turn",
    },
    text: "【Once per Turn】",
  },
];

export const tallgeese: GundamitoUnitCard = {
  id: "ST02-006",
  implemented: false,
  missingTestCase: true,
  cost: 4,
  level: 5,
  number: 6,
  name: "Tallgeese",
  color: "blue",
  set: "ST02",
  rarity: "legendary",
  imageUrl: "../images/cards/card/ST02-006.webp?250711",
  imgAlt: "Tallgeese",
  type: "unit",
  zones: ["space", "earth"],
  traits: [],
  linkRequirement: ["zechs merquise"],
  ap: 4,
  hp: 4,
  text: "【Activate･Main】【Once per Turn】④：Set this Unit as active.",
  abilities: abilities,
};
