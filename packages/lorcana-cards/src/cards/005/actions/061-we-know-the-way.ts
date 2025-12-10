import type { ActionCard } from "@tcg/lorcana";

export const weKnowTheWay: ActionCard = {
  id: "3jr",
  cardType: "action",
  name: "We Know the Way",
  inkType: ["amethyst"],
  franchise: "Moana",
  set: "005",
  text: "Shuffle chosen card from your discard into your deck. Reveal the top card of your deck. If it has the same name as the chosen card, you may play the revealed card for free. Otherwise, put it into your hand.",
  actionSubtype: "song",
  cost: 3,
  cardNumber: 61,
  inkable: true,
  externalIds: {
    ravensburger: "0cca9fb008e3df3430585d8838427da91697bdd4",
  },
  abilities: [
    {
      id: "3jr-1",
      text: "Shuffle chosen card from your discard into your deck. Reveal the top card of your deck. If it has the same name as the chosen card, you may play the revealed card for free. Otherwise, put it into your hand.",
      type: "action",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "shuffle-into-deck",
            target: {
              selector: "chosen",
              zone: "discard",
            },
          },
          {
            type: "reveal-top-card",
            target: "CONTROLLER",
          },
          {
            type: "conditional",
            condition: {
              type: "revealed-matches-chosen-name",
            },
            then: {
              type: "optional",
              effect: {
                type: "play-card",
                from: "revealed",
                cost: "free",
              },
            },
            else: {
              type: "put-in-hand",
              from: "revealed",
            },
          },
        ],
      },
    },
  ],
};
