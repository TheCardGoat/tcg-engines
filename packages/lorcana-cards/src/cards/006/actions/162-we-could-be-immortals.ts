import type { ActionCard } from "@tcg/lorcana-types";

export const weCouldBeImmortals: ActionCard = {
  abilities: [
    {
      effect: {
        steps: [
          {
            duration: "this-turn",
            keyword: "Resist",
            target: "YOUR_CHARACTERS",
            type: "gain-keyword",
            value: 6,
          },
          {
            exerted: true,
            facedown: true,
            source: "this-card",
            target: "CONTROLLER",
            type: "put-into-inkwell",
          },
        ],
        type: "sequence",
      },
      id: "ulc-1",
      name: "Your Inventor",
      text: "Your Inventor characters gain Resist +6 this turn. Then, put this card into your inkwell facedown and exerted.",
      type: "static",
    },
  ],
  actionSubtype: "song",
  cardNumber: 162,
  cardType: "action",
  cost: 4,
  externalIds: {
    ravensburger: "6e428663c224995945b62be7fe69cd44cbb42939",
  },
  franchise: "Big Hero 6",
  id: "ulc",
  inkType: ["sapphire"],
  inkable: true,
  missingTests: true,
  name: "We Could Be Immortals",
  set: "006",
  text: "Your Inventor characters gain Resist +6 this turn. Then, put this card into your inkwell facedown and exerted. (Damage dealt to them is reduced by 6.)",
};
