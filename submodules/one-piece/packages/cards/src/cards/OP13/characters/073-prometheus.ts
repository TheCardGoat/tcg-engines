import type { CharacterCard } from "@tcg/op-types";
import { op13Prometheus073I18n } from "./073-prometheus.i18n.ts";

export const op13Prometheus073: CharacterCard = {
  id: "OP13-073",
  canonicalId: "OP13-073",
  slug: "prometheus",
  name: "Prometheus",
  printings: [
    {
      id: "OP13-073",
      artId: "OP13-073",
      setCode: "OP13",
      collectorNumber: "073",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP13-073_AazqEJI.jpg",
    },
  ],
  cardType: "character",
  color: ["purple"],
  rarity: "UC",
  setId: "OP13",
  cost: 5,
  power: 6000,
  counter: 2000,
  traits: ["Big Mom Pirates Homies"],
  attribute: "special",
  i18n: op13Prometheus073I18n,
};
