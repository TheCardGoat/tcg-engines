import type { CharacterCard } from "@tcg/op-types";
import { op02Onigumo095I18n } from "./095-onigumo.i18n.ts";

export const op02Onigumo095: CharacterCard = {
  id: "OP02-095",
  canonicalId: "OP02-095",
  slug: "onigumo",
  name: "Onigumo",
  printings: [
    {
      id: "OP02-095",
      artId: "OP02-095",
      setCode: "OP02",
      collectorNumber: "095",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP02-095.jpg",
    },
  ],
  cardType: "character",
  color: ["black"],
  rarity: "UC",
  setId: "OP02",
  cost: 5,
  power: 6000,
  counter: 1000,
  traits: ["Navy"],
  attribute: "slash",
  effect:
    "If there is a Character with a cost of 0, this Character gains [Banish]. (When this card deals damage, the target card is trashed without activating its Trigger.)",
  i18n: op02Onigumo095I18n,
};
