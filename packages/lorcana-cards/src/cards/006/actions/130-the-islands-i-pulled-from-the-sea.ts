import type { ActionCard } from "@tcg/lorcana-types";

export const theIslandsIPulledFromTheSea: ActionCard = {
  abilities: [
    {
      effect: {
        cardType: "location",
        putInto: "hand",
        shuffle: true,
        type: "search-deck",
      },
      id: "pm0-1",
      text: "Search your deck for a location card, reveal that card to all players, and put it into your hand. Then, shuffle your deck.",
      type: "action",
    },
  ],
  actionSubtype: "song",
  cardNumber: 130,
  cardType: "action",
  cost: 3,
  externalIds: {
    ravensburger: "5c4e5d5a2a02a6032d8112a3e0f6e3d89ae1a904",
  },
  franchise: "Moana",
  id: "pm0",
  inkType: ["ruby"],
  inkable: false,
  missingTests: true,
  name: "The Islands I Pulled from the Sea",
  set: "006",
  text: "Search your deck for a location card, reveal that card to all players, and put it into your hand. Then, shuffle your deck.",
};
