import type { CharacterCard } from "@tcg/op-types";
import { op09Crocodile025I18n } from "./025-crocodile.i18n.ts";

export const op09Crocodile025: CharacterCard = {
  id: "OP09-025",
  canonicalId: "OP09-025",
  slug: "crocodile/op09-025",
  name: "Crocodile",
  printings: [
    {
      id: "OP09-025",
      artId: "OP09-025",
      setCode: "OP09",
      collectorNumber: "025",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP09-025.jpg",
    },
  ],
  cardType: "character",
  color: ["green"],
  rarity: "UC",
  setId: "OP09",
  cost: 4,
  power: 5000,
  counter: 1000,
  traits: ["Baroque Works The Seven Warlords of the Sea ODYSSEY"],
  attribute: "special",
  effect:
    'If your Leader has the "ODYSSEY" type, this Character cannot be K.O.\'d in battle by Leaders.',
  i18n: op09Crocodile025I18n,
};
