import type { ItemCard } from "@tcg/lorcana-types";
import { poohPirateShipI18n } from "./032-pooh-pirate-ship.i18n";

export const poohPirateShip: ItemCard = {
  id: "zKX",
  canonicalId: "ci_zKX",
  reprints: ["set6-032"],
  cardType: "item",
  name: "Pooh Pirate Ship",
  inkType: ["amber"],
  franchise: "Winnie the Pooh",
  set: "006",
  cardNumber: 32,
  rarity: "rare",
  cost: 1,
  inkable: false,
  externalIds: {
    lorcast: "crd_4251575ec547497da73676a6a09c8872",
    tcgPlayer: 587239,
  },
  text: [
    {
      title: "MAKE A RESCUE",
      description: "{E}, 3 {I} — Return a Pirate character card from your discard to your hand.",
    },
  ],
  abilities: [
    {
      cost: {
        exert: true,
        ink: 3,
      },
      effect: {
        cardType: "character",
        filter: {
          type: "has-classification",
          classification: "Pirate",
        },
        target: "CONTROLLER",
        type: "return-from-discard",
      },
      id: "6g9-1",
      name: "MAKE A RESCUE",
      text: "MAKE A RESCUE {E}, 3 {I} — Return a Pirate character card from your discard to your hand.",
      type: "activated",
    },
  ],
  i18n: poohPirateShipI18n,
};
