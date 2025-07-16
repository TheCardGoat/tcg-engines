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
  type: "unit",
  zones: ["space"],
  traits: ["earth federation"],
  linkRequirement: ["amuro ray"],
  ap: 4,
  hp: 3,
  abilities: abilities,
  text: "【When Paired･(White Base Team) Pilot】Draw 1.",
};
