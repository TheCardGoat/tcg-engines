import type { CharacterCard } from "@tcg/op-types";
import { op07MonkeyDLuffy033I18n } from "./033-monkey-d-luffy.i18n.ts";

export const op07MonkeyDLuffy033: CharacterCard = {
  id: "OP07-033",
  canonicalId: "OP07-033",
  slug: "monkey-d-luffy/op07-033",
  name: "Monkey.D.Luffy",
  printings: [
    {
      id: "OP07-033",
      artId: "OP07-033",
      setCode: "OP07",
      collectorNumber: "033",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP07-033.jpg",
    },
  ],
  cardType: "character",
  color: ["green"],
  rarity: "UC",
  setId: "OP07",
  cost: 5,
  power: 6000,
  counter: 1000,
  traits: ["Straw Hat Crew Supernovas"],
  attribute: "strike",
  effect:
    "If you have 3 or more Characters, your Characters with a cost of 3 or less other than [Monkey.D.Luffy] cannot be K.O.'d by your opponent's effects.",
  i18n: op07MonkeyDLuffy033I18n,
};
