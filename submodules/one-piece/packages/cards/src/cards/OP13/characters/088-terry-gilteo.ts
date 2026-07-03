import type { CharacterCard } from "@tcg/op-types";
import { op13TerryGilteo088I18n } from "./088-terry-gilteo.i18n.ts";

export const op13TerryGilteo088: CharacterCard = {
  id: "OP13-088",
  canonicalId: "OP13-088",
  slug: "terry-gilteo",
  name: "Terry Gilteo",
  printings: [
    {
      id: "OP13-088",
      artId: "OP13-088",
      setCode: "OP13",
      collectorNumber: "088",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP13-088_QNMqEg1.jpg",
    },
  ],
  cardType: "character",
  color: ["black"],
  rarity: "UC",
  setId: "OP13",
  cost: 5,
  power: 6000,
  counter: 2000,
  traits: ["Revolutionary Army"],
  attribute: "wisdom",
  i18n: op13TerryGilteo088I18n,
};
