import type { CharacterCard } from "@tcg/op-types";
import { op01Hajrudin018I18n } from "./018-hajrudin.i18n.ts";

export const op01Hajrudin018: CharacterCard = {
  id: "OP01-018",
  canonicalId: "OP01-018",
  slug: "hajrudin/op01-018",
  name: "Hajrudin",
  printings: [
    {
      id: "OP01-018",
      artId: "OP01-018",
      setCode: "OP01",
      collectorNumber: "018",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP01-018.jpg",
    },
  ],
  cardType: "character",
  color: ["red"],
  rarity: "C",
  setId: "OP01",
  cost: 4,
  power: 6000,
  counter: 1000,
  traits: ["Giant New Giant Pirate Crew"],
  attribute: "strike",
  effect: "NULL",
  i18n: op01Hajrudin018I18n,
};
