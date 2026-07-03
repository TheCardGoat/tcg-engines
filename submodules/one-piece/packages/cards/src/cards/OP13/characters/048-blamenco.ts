import type { CharacterCard } from "@tcg/op-types";
import { op13Blamenco048I18n } from "./048-blamenco.i18n.ts";

export const op13Blamenco048: CharacterCard = {
  id: "OP13-048",
  canonicalId: "OP13-048",
  slug: "blamenco/op13-048",
  name: "Blamenco",
  printings: [
    {
      id: "OP13-048",
      artId: "OP13-048",
      setCode: "OP13",
      collectorNumber: "048",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP13-048_zr15xba.jpg",
    },
  ],
  cardType: "character",
  color: ["blue"],
  rarity: "UC",
  setId: "OP13",
  cost: 5,
  power: 6000,
  counter: 2000,
  traits: ["Whitebeard Pirates"],
  attribute: "strike",
  i18n: op13Blamenco048I18n,
};
