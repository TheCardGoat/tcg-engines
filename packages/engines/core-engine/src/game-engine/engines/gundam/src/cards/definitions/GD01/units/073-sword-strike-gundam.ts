import type { GundamitoUnitCard } from "../../cardTypes";

const abilities: GundamitoUnitCard["abilities"] = [
  {
    type: "triggered",
    effects: [
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
        condition: "2 or less HP",
        targetText: "enemy Unit",
        originalText: "Choose 1 enemy Unit with 2 or less HP.",
      },
    ],
    trigger: {
      event: "attack",
    },
    text: "【attack】",
  },
];

export const swordStrikeGundam: GundamitoUnitCard = {
  id: "GD01-073",
  implemented: false,
  missingTestCase: true,
  cost: 3,
  level: 4,
  number: 73,
  name: "Sword Strike Gundam",
  color: "white",
  set: "GD01",
  rarity: "uncommon",
  imageUrl: "../images/cards/card/GD01-073.webp?250711",
  imgAlt: "Sword Strike Gundam",
  type: "unit",
  zones: ["space", "earth"],
  traits: ["earth federation"],
  linkRequirement: ["(earth alliance) trait"],
  ap: 4,
  hp: 3,
  text: "【During Link】【Attack】Choose 1 enemy Unit with 2 or less HP. Return it to its owner&#039;s hand.",
  abilities: abilities,
};
