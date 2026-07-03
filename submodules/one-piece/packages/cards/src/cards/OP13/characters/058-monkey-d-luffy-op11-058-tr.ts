import type { CharacterCard } from "@tcg/op-types";
import { op13MonkeyDLuffyOp11058Tr058I18n } from "./058-monkey-d-luffy-op11-058-tr.i18n.ts";

export const op13MonkeyDLuffyOp11058Tr058: CharacterCard = {
  id: "OP11-058",
  canonicalId: "OP11-058",
  slug: "monkey-d-luffy-op11-058-tr",
  name: "Monkey.D.Luffy - OP11-058 (TR)",
  printings: [
    {
      id: "OP11-058",
      artId: "OP11-058",
      setCode: "OP13",
      collectorNumber: "058",
      rarity: "TR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP11-058_p1_pUjWFdt.png",
    },
  ],
  cardType: "character",
  color: ["blue"],
  rarity: "TR",
  setId: "OP13",
  cost: 5,
  power: 7000,
  counter: 1000,
  traits: ["Straw Hat Crew"],
  attribute: "strike",
  effect:
    "If you have 5 or more cards in your hand, this Character cannot attack.[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.)",
  effects: {
    keywords: ["blocker"],
  },
  i18n: op13MonkeyDLuffyOp11058Tr058I18n,
};
