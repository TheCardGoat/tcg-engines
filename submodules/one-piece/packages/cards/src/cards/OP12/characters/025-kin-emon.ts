import type { CharacterCard } from "@tcg/op-types";
import { op12KinEmon025I18n } from "./025-kin-emon.i18n.ts";

export const op12KinEmon025: CharacterCard = {
  id: "OP12-025",
  canonicalId: "OP12-025",
  slug: "kin-emon/op12-025",
  name: "Kin'emon",
  printings: [
    {
      id: "OP12-025",
      artId: "OP12-025",
      setCode: "OP12",
      collectorNumber: "025",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP12-025_Tk4JEOG.jpg",
    },
  ],
  cardType: "character",
  color: ["green"],
  rarity: "C",
  setId: "OP12",
  cost: 6,
  power: 8000,
  counter: 1000,
  traits: ["Land of Wano The Akazaya Nine"],
  attribute: "slash",
  i18n: op12KinEmon025I18n,
};
