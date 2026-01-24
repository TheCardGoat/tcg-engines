import type { ItemCard } from "@tcg/lorcana-types";

export const blessedBagpipes: ItemCard = {
  id: "a2n",
  cardType: "item",
  name: "Blessed Bagpipes",
  inkType: ["emerald"],
  franchise: "Ducktales",
  set: "010",
  text: "MCDUCK HEIRLOOM When you play this item, you may put the top card of your deck facedown under one of your characters or locations with Boost.\nBATTLE ANTHEM Whenever one of your characters or locations with a card under them is challenged, gain 1 lore.",
  cost: 2,
  cardNumber: 101,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "244e0c0000d6488f1bcd68eec3bac2b5a565933e",
  },
  abilities: [
    {
      id: "a2n-2",
      type: "triggered",
      name: "BATTLE ANTHEM",
      trigger: {
        event: "banish",
        timing: "whenever",
        on: "YOUR_OTHER_CHARACTERS",
      },
      effect: {
        type: "gain-lore",
        amount: 1,
      },
      text: "BATTLE ANTHEM Whenever one of your characters or locations with a card under them is challenged, gain 1 lore.",
    },
  ],
};
