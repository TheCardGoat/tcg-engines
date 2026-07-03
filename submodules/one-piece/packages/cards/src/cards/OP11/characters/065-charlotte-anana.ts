import type { CharacterCard } from "@tcg/op-types";
import { op11CharlotteAnana065I18n } from "./065-charlotte-anana.i18n.ts";

export const op11CharlotteAnana065: CharacterCard = {
  id: "OP11-065",
  canonicalId: "OP11-065",
  slug: "charlotte-anana",
  name: "Charlotte Anana",
  printings: [
    {
      id: "OP11-065",
      artId: "OP11-065",
      setCode: "OP11",
      collectorNumber: "065",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP11-065.jpg",
    },
  ],
  cardType: "character",
  color: ["purple"],
  rarity: "UC",
  setId: "OP11",
  cost: 1,
  power: 1000,
  counter: 1000,
  traits: ["Big Mom Pirates"],
  attribute: "wisdom",
  effect:
    'If you have a purple "Big Mom Pirates" type Character other than [Charlotte Anana], this Character gains [Blocker].\n(After your opponent declares an attack, you may rest this card to make it the new target of the attack.)',
  i18n: op11CharlotteAnana065I18n,
};
