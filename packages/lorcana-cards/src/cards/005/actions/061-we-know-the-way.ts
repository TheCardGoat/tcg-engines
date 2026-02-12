import type { ActionCard } from "@tcg/lorcana-types";

export const weKnowTheWay: ActionCard = {
  abilities: [
    {
      effect: {
        type: "sequence",
        steps: [
          {
            type: "shuffle-into-deck",
            target: {
              selector: "chosen",
              count: 1,
              filter: [{ type: "zone", zone: "discard" }],
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
                from: "deck",
                cost: "free",
              },
            },
            else: {
              type: "put-in-hand",
              target: "CONTROLLER",
              source: "deck",
            },
          },
        ],
      },
      id: "3jr-1",
      text: "Shuffle chosen card from your discard into your deck. Reveal the top card of your deck. If it has the same name as the chosen card, you may play the revealed card for free. Otherwise, put it into your hand.",
      type: "action",
    },
  ],
  actionSubtype: "song",
  cardNumber: 61,
  cardType: "action",
  cost: 3,
  externalIds: {
    ravensburger: "0cca9fb008e3df3430585d8838427da91697bdd4",
  },
  franchise: "Moana",
  id: "3jr",
  inkType: ["amethyst"],
  inkable: true,
  name: "We Know the Way",
  set: "005",
  text: "Shuffle chosen card from your discard into your deck. Reveal the top card of your deck. If it has the same name as the chosen card, you may play the revealed card for free. Otherwise, put it into your hand.",
};
