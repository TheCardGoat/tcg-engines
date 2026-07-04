import type { CharacterCard } from "@tcg/op-types";
import { op09RobLucci038I18n } from "./038-rob-lucci.i18n.ts";

export const op09RobLucci038: CharacterCard = {
  id: "OP09-038",
  canonicalId: "OP09-038",
  slug: "rob-lucci/op09-038",
  name: "Rob Lucci",
  printings: [
    {
      id: "OP09-038",
      artId: "OP09-038",
      setCode: "OP09",
      collectorNumber: "038",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP09-038.jpg",
    },
  ],
  cardType: "character",
  color: ["green"],
  rarity: "C",
  setId: "OP09",
  cost: 4,
  power: 6000,
  counter: 1000,
  traits: ["CP9 ODYSSEY"],
  attribute: "strike",
  i18n: op09RobLucci038I18n,
};
