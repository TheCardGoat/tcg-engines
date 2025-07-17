import type { GundamitoUnitCard } from "../../cardTypes";

const abilities: GundamitoUnitCard["abilities"] = [
  {
    type: "triggered",
    effects: [
      {
        type: "discard",
        amount: 1,
        originalText: "Discard 1",
      },
      {
        type: "targeting",
        amount: "1",
        target: {
          type: "unit",
          value: 1,
          filters: [
            {
              filter: "type",
              value: "unit",
            },
          ],
          zone: "battlefield",
          isMultiple: false,
        },
        condition: "",
        targetText: "(Newtype) Pilot card that is Lv",
        originalText: "choose 1 (Newtype) Pilot card that is Lv.",
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
      {
        type: "rule",
        ruleText: "Newtype",
        originalText: "(Newtype)",
      },
    ],
    trigger: {
      event: "activate･main",
    },
    text: "【activate･main】",
  },
];

export const char039sGelgoog: GundamitoUnitCard = {
  id: "GD01-023",
  implemented: false,
  missingTestCase: true,
  cost: 4,
  level: 4,
  number: 23,
  name: "Char&#039;s Gelgoog",
  color: "green",
  set: "GD01",
  rarity: "legendary",
  imageUrl: "../images/cards/card/GD01-023.webp?250711",
  imgAlt: "Char&#039;s Gelgoog",
  type: "unit",
  zones: ["space", "earth"],
  traits: ["zeon"],
  linkRequirement: ["char aznable"],
  ap: 4,
  hp: 3,
  text: "【Activate･Main】Discard 1 (Zeon)/(Neo Zeon) Unit card：If a Pilot is not paired with this Unit, choose 1 (Newtype) Pilot card that is Lv.3 or lower from your trash. Pair it with this Unit.",
  abilities: abilities,
};
