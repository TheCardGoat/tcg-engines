import type { ActionCard } from "@tcg/lorcana-types";
import { khanTransportDeliveryI18n } from "./199-khan-transport-delivery.i18n";

export const khanTransportDelivery: ActionCard = {
  id: "PuN",
  canonicalId: "ci_PuN",
  slug: "lorcana-ci_PuN",
  printings: [
    {
      id: "set14-199",
      artId: "set14-199",
      setCode: "set14",
      collectorNumber: "199",
      rarity: "common",
      imageUrl: "",
    },
  ],
  reprints: ["set14-199"],
  cardType: "action",
  name: "Khan Transport Delivery",
  inkType: ["steel"],
  franchise: "Talespin",
  set: "014",
  cardNumber: 199,
  rarity: "common",
  cost: 2,
  inkable: false,
  externalIds: {
    lorcast: "crd_ae2b39a99d464b1aab4e5a15250467d2",
  },
  text: "Draw a card. Get 1 ink drop. (You may remove an ink drop to pay 1 {I}.)",
  abilities: [
    {
      type: "action",
      text: "Draw a card. Get 1 ink drop. (You may remove an ink drop to pay 1 {I}.)",
      effect: {
        type: "sequence",
        steps: [
          { type: "draw", amount: 1, target: "CONTROLLER" },
          { type: "gain-ink-drop", amount: 1, target: "CONTROLLER" },
        ],
      },
    },
  ],
  i18n: khanTransportDeliveryI18n,
};
