import type { CharacterCard } from "@tcg/op-types";
import { op02DraculeMihawk055I18n } from "./055-dracule-mihawk.i18n.ts";

export const op02DraculeMihawk055: CharacterCard = {
  id: "OP02-055",
  canonicalId: "OP02-055",
  slug: "dracule-mihawk/op02-055",
  name: "Dracule Mihawk",
  printings: [
    {
      id: "OP02-055",
      artId: "OP02-055",
      setCode: "OP02",
      collectorNumber: "055",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP02-055.jpg",
    },
  ],
  cardType: "character",
  color: ["blue"],
  rarity: "C",
  setId: "OP02",
  cost: 6,
  power: 8000,
  counter: 1000,
  traits: ["The Seven Warlords of the Sea"],
  attribute: "slash",
  effect: "NULL",
  i18n: op02DraculeMihawk055I18n,
};
