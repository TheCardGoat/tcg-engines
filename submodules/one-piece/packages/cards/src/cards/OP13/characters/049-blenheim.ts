import type { CharacterCard } from "@tcg/op-types";
import { op13Blenheim049I18n } from "./049-blenheim.i18n.ts";

export const op13Blenheim049: CharacterCard = {
  id: "OP13-049",
  canonicalId: "OP13-049",
  slug: "blenheim/op13-049",
  name: "Blenheim",
  printings: [
    {
      id: "OP13-049",
      artId: "OP13-049",
      setCode: "OP13",
      collectorNumber: "049",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP13-049_cQMyJNS.jpg",
    },
  ],
  cardType: "character",
  color: ["blue"],
  rarity: "UC",
  setId: "OP13",
  cost: 6,
  power: 7000,
  counter: 2000,
  traits: ["Whitebeard Pirates"],
  attribute: "slash",
  i18n: op13Blenheim049I18n,
};
