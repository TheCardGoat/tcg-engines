import type { GundamitoUnitCard } from "../../cardTypes";

const abilities: GundamitoUnitCard["abilities"] = [
  {
    type: "triggered",
    effects: [
      {
        type: "draw",
        amount: 1,
      },
    ],
    trigger: {
      event: "when-paired･(white-base-team)-pilot",
    },
    text: "【when paired･(white base team) pilot】",
  },
];

export const gundamMaForm: GundamitoUnitCard = {
  id: "ST01-002",
  implemented: false,
  missingTestCase: true,
  cost: 3,
  level: 5,
  number: 2,
  name: "Gundam (MA Form)",
  color: "blue",
  set: "ST01",
  rarity: "common",
  imageUrl: "../images/cards/card/ST01-002.webp?250711",
  imgAlt: "Gundam (MA Form)",
  type: "unit",
  zones: ["space"],
  traits: ["earth federation"],
  linkRequirement: ["amuro ray"],
  ap: 4,
  hp: 3,
  text: "【When Paired･(White Base Team) Pilot】Draw 1.",
  abilities: abilities,
};
