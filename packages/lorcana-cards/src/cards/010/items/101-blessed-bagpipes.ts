import type { ItemCard } from "@tcg/lorcana-types";

export const blessedBagpipes: ItemCard = {
  abilities: [
    {
      effect: {
        type: "gain-lore",
        amount: 1,
      },
      id: "a2n-2",
      name: "BATTLE ANTHEM",
      text: "BATTLE ANTHEM Whenever one of your characters or locations with a card under them is challenged, gain 1 lore.",
      trigger: {
        event: "banish",
        timing: "whenever",
        on: "YOUR_OTHER_CHARACTERS",
      },
      type: "triggered",
    },
  ],
  cardNumber: 101,
  cardType: "item",
  cost: 2,
  externalIds: {
    ravensburger: "244e0c0000d6488f1bcd68eec3bac2b5a565933e",
  },
  franchise: "Ducktales",
  id: "a2n",
  inkType: ["emerald"],
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  name: "Blessed Bagpipes",
  set: "010",
  text: "MCDUCK HEIRLOOM When you play this item, you may put the top card of your deck facedown under one of your characters or locations with Boost.\nBATTLE ANTHEM Whenever one of your characters or locations with a card under them is challenged, gain 1 lore.",
};
