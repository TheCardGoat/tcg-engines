import type { CharacterCard } from "@tcg/op-types";
import { op13AmatsukiToki060I18n } from "./060-amatsuki-toki.i18n.ts";

export const op13AmatsukiToki060: CharacterCard = {
  id: "OP13-060",
  canonicalId: "OP13-060",
  slug: "amatsuki-toki",
  name: "Amatsuki Toki",
  printings: [
    {
      id: "OP13-060",
      artId: "OP13-060",
      setCode: "OP13",
      collectorNumber: "060",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP13-060_CsSydRY.jpg",
    },
  ],
  cardType: "character",
  color: ["purple"],
  rarity: "C",
  setId: "OP13",
  cost: 2,
  power: 3000,
  counter: 1000,
  traits: ["Land of Wano Roger Pirates"],
  attribute: "wisdom",
  effect:
    "If your Character with a type including \"Roger Pirates\" would be K.O.'d by your opponent's effect, you may trash this Character instead.",
  i18n: op13AmatsukiToki060I18n,
};
