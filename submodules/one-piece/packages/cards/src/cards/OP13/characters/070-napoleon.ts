import type { CharacterCard } from "@tcg/op-types";
import { op13Napoleon070I18n } from "./070-napoleon.i18n.ts";

export const op13Napoleon070: CharacterCard = {
  id: "OP13-070",
  canonicalId: "OP13-070",
  slug: "napoleon/op13-070",
  name: "Napoleon",
  printings: [
    {
      id: "OP13-070",
      artId: "OP13-070",
      setCode: "OP13",
      collectorNumber: "070",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP13-070_v85HbM8.jpg",
    },
  ],
  cardType: "character",
  color: ["purple"],
  rarity: "C",
  setId: "OP13",
  cost: 5,
  power: 7000,
  counter: 1000,
  traits: ["Big Mom Pirates Homies"],
  attribute: "slash",
  i18n: op13Napoleon070I18n,
};
