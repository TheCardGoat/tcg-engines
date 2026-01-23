import type { ActionCard } from "@tcg/lorcana-types";

export const trustInMe: ActionCard = {
  id: "1dp",
  cardType: "action",
  name: "Trust In Me",
  inkType: ["emerald"],
  franchise: "Jungle Book",
  set: "010",
  text: "Choose one:\n- Each opposing character gets -1 until the start of your next turn.\n- Each opponent chooses and discards 2 cards.",
  actionSubtype: "song",
  cost: 6,
  cardNumber: 95,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "b17a10c1e0053183dab165c61690caaa7796d6a5",
  },
  abilities: [],
};
