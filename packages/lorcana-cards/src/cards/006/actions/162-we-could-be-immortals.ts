import type { ActionCard } from "@tcg/lorcana-types";

export const weCouldBeImmortals: ActionCard = {
  id: "ulc",
  cardType: "action",
  name: "We Could Be Immortals",
  inkType: ["sapphire"],
  franchise: "Big Hero 6",
  set: "006",
  text: "Your Inventor characters gain Resist +6 this turn. Then, put this card into your inkwell facedown and exerted. (Damage dealt to them is reduced by 6.)",
  actionSubtype: "song",
  cost: 4,
  cardNumber: 162,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "6e428663c224995945b62be7fe69cd44cbb42939",
  },
  abilities: [
    {
      id: "ulc-1",
      type: "static",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "gain-keyword",
            keyword: "Resist",
            target: "YOUR_CHARACTERS",
            value: 6,
            duration: "this-turn",
          },
          {
            type: "put-into-inkwell",
            source: "this-card",
            target: "CONTROLLER",
            exerted: true,
            facedown: true,
          },
        ],
      },
      name: "Your Inventor",
      text: "Your Inventor characters gain Resist +6 this turn. Then, put this card into your inkwell facedown and exerted.",
    },
  ],
};
