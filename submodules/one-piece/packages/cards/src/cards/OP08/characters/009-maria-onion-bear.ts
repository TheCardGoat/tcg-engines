import type { CharacterCard } from "@tcg/op-types";
import { op08MariaOnionBear009I18n } from "./009-maria-onion-bear.i18n.ts";

export const op08MariaOnionBear009: CharacterCard = {
  id: "OP08-009",
  canonicalId: "OP08-009",
  slug: "maria-onion-bear",
  name: "Maria Onion Bear",
  printings: [
    {
      id: "OP08-009",
      artId: "OP08-009",
      setCode: "OP08",
      collectorNumber: "009",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP08-009.jpg",
    },
  ],
  cardType: "character",
  color: ["red"],
  rarity: "C",
  setId: "OP08",
  cost: 3,
  power: 5000,
  counter: 1000,
  traits: ["Drum Kingdom"],
  attribute: "wisdom",
  effect: "NULL",
  i18n: op08MariaOnionBear009I18n,
};
