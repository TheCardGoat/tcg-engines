import type { GundamitoCommandCard } from "../../cardTypes";

const abilities: GundamitoCommandCard["abilities"] = [
  {
    type: "triggered",
    effects: [
      {
        type: "placeholder",
        parameters: {},
      },
    ],
    trigger: {
      event: "action",
    },
    text: "【Action】",
  },
];

export const peacefulTimbre: GundamitoCommandCard = {
  id: "ST02-013",
  implemented: false,
  missingTestCase: true,
  cost: 1,
  level: 4,
  number: 13,
  name: "Peaceful Timbre",
  color: "green",
  set: "ST02",
  rarity: "common",
  imageUrl: "../images/cards/card/ST02-013.webp?250711",
  imgAlt: "Peaceful Timbre",
  type: "command",
  text: "【Action】During this battle, your shield area cards can't receive damage from enemy Units that are Lv.4 or lower.",
  abilities: abilities,
};
