import type { ItemCard } from "@tcg/lorcana-types";
import { sardineCanI18n } from "./170-sardine-can.i18n";

export const sardineCan: ItemCard = {
  id: "QGa",
  canonicalId: "ci_QGa",
  reprints: ["set2-170"],
  cardType: "item",
  name: "Sardine Can",
  inkType: ["sapphire"],
  franchise: "Rescuers",
  set: "002",
  cardNumber: 170,
  rarity: "uncommon",
  cost: 4,
  inkable: true,
  externalIds: {
    lorcast: "crd_ac6b41f1d4314cd48a6c0e40b01203fd",
    tcgPlayer: 527771,
  },
  text: [
    {
      title: "FLIGHT CABIN",
      description: "Your exerted characters gain Ward.",
    },
  ],
  abilities: [
    {
      effect: {
        keyword: "Ward",
        target: "YOUR_EXERTED_CHARACTERS",
        type: "gain-keyword",
      },
      id: "2oi-1",
      name: "FLIGHT CABIN",
      text: "FLIGHT CABIN Your exerted characters gain Ward.",
      type: "static",
    },
  ],
  i18n: sardineCanI18n,
};
