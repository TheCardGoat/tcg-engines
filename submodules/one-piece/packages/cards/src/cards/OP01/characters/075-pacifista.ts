import type { CharacterCard } from "@tcg/op-types";
import { op01Pacifista075I18n } from "./075-pacifista.i18n.ts";

export const op01Pacifista075: CharacterCard = {
  id: "OP01-075",
  canonicalId: "OP01-075",
  slug: "pacifista/op01-075",
  name: "Pacifista",
  printings: [
    {
      id: "OP01-075",
      artId: "OP01-075",
      setCode: "OP01",
      collectorNumber: "075",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP01-075.jpg",
    },
  ],
  cardType: "character",
  color: ["blue"],
  rarity: "C",
  setId: "OP01",
  cost: 4,
  power: 5000,
  traits: ["Biological Weapon Navy"],
  attribute: "special",
  effect:
    "Under the rules of this game, you may have any number of this card in your deck. [Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.)",
  effects: {
    deckBuildingRules: [{ rule: "unlimitedCopies" }],
    keywords: ["blocker"],
  },
  i18n: op01Pacifista075I18n,
};
