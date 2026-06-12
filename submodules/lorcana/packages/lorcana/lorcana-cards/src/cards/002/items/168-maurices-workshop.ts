import type { ItemCard } from "@tcg/lorcana-types";
import { mauricesWorkshopI18n } from "./168-maurices-workshop.i18n";

export const mauricesWorkshop: ItemCard = {
  id: "Xlt",
  canonicalId: "ci_Xlt",
  reprints: ["set2-168"],
  cardType: "item",
  name: "Maurice's Workshop",
  inkType: ["sapphire"],
  franchise: "Beauty and the Beast",
  set: "002",
  cardNumber: 168,
  rarity: "rare",
  cost: 3,
  inkable: false,
  externalIds: {
    lorcast: "crd_3c5cc621f8c2419aa3e82f1189fb74b0",
    tcgPlayer: 527770,
  },
  text: [
    {
      title: "LOOKING FOR THIS?",
      description: "Whenever you play another item, you may pay 1 {I} to draw a card.",
    },
  ],
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          type: "pay-cost",
          cost: {
            ink: 1,
          },
          effect: {
            amount: 1,
            target: "CONTROLLER",
            type: "draw",
          },
        },
        type: "optional",
      },
      id: "18c-1",
      name: "LOOKING FOR THIS?",
      text: "LOOKING FOR THIS? Whenever you play another item, you may pay 1 {I} to draw a card.",
      trigger: {
        event: "play",
        on: {
          cardType: "item",
          controller: "you",
          excludeSelf: true,
        },
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  i18n: mauricesWorkshopI18n,
};
