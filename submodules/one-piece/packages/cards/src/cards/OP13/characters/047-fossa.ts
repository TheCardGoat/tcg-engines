import type { CharacterCard } from "@tcg/op-types";
import { op13Fossa047I18n } from "./047-fossa.i18n.ts";

export const op13Fossa047: CharacterCard = {
  id: "OP13-047",
  canonicalId: "OP13-047",
  slug: "fossa/op13-047",
  name: "Fossa",
  printings: [
    {
      id: "OP13-047",
      artId: "OP13-047",
      setCode: "OP13",
      collectorNumber: "047",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP13-047_ttYExC8.jpg",
    },
  ],
  cardType: "character",
  color: ["blue"],
  rarity: "C",
  setId: "OP13",
  cost: 2,
  power: 3000,
  counter: 1000,
  traits: ["Whitebeard Pirates"],
  attribute: "slash",
  effect:
    "If your Character with a type including \"Whitebeard Pirates\" would be K.O.'d by your opponent's effect, you may trash this Character instead.",
  i18n: op13Fossa047I18n,
};
