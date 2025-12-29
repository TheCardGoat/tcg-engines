import type { ItemCard } from "@tcg/lorcana";

export const musketeerTabard: ItemCard = {
  id: "8a5",
  cardType: "item",
  name: "Musketeer Tabard",
  inkType: ["steel"],
  set: "001",
  text: "ALL FOR ONE AND ONE FOR ALL Whenever one of your characters with Bodyguard is banished, you may draw a card.",
  cost: 4,
  cardNumber: 203,
  inkable: false,
  externalIds: {
    ravensburger: "1dd9513f5330b41950fea67f21d19e751b9551a2",
  },
  abilities: [
    {
      id: "8a5-1",
      text: "ALL FOR ONE AND ONE FOR ALL Whenever one of your characters with Bodyguard is banished, you may draw a card.",
      name: "ALL FOR ONE AND ONE FOR ALL",
      type: "triggered",
      trigger: {
        event: "banish",
        timing: "whenever",
        on: "YOUR_OTHER_CHARACTERS",
      },
      effect: {
        type: "optional",
        effect: {
          type: "draw",
          amount: 1,
          target: "CONTROLLER",
        },
        chooser: "CONTROLLER",
      },
    },
  ],
};
