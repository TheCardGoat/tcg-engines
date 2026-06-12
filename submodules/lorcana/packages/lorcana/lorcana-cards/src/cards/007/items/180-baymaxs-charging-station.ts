import type { ItemCard } from "@tcg/lorcana-types";
import { baymaxsChargingStationI18n } from "./180-baymaxs-charging-station.i18n";

export const baymaxsChargingStation: ItemCard = {
  id: "Xqf",
  canonicalId: "ci_Xqf",
  reprints: ["set7-180"],
  cardType: "item",
  name: "Baymax's Charging Station",
  inkType: ["sapphire"],
  franchise: "Big Hero 6",
  set: "007",
  cardNumber: 180,
  rarity: "common",
  cost: 3,
  inkable: true,
  externalIds: {
    lorcast: "crd_c2a15901752f4d5289f1296558834989",
    tcgPlayer: 618725,
  },
  text: [
    {
      title: "ENERGY CONVERTER",
      description:
        "Whenever you play a Floodborn character, if you used Shift to play them, you may draw a card.",
    },
  ],
  abilities: [
    {
      condition: {
        type: "play-context",
        context: "used-shift",
      },
      effect: {
        type: "optional",
        chooser: "CONTROLLER",
        effect: {
          amount: 1,
          target: "CONTROLLER",
          type: "draw",
        },
      },
      id: "zom-1",
      name: "ENERGY CONVERTER",
      text: "ENERGY CONVERTER Whenever you play a Floodborn character, if you used Shift to play them, you may draw a card.",
      trigger: {
        event: "play",
        on: {
          cardType: "character",
          classification: "Floodborn",
          controller: "you",
        },
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  i18n: baymaxsChargingStationI18n,
};
