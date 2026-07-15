import type { CharacterCard } from "@tcg/op-types";
import { op11Ripper096I18n } from "./096-ripper.i18n.ts";

export const op11Ripper096: CharacterCard = {
  id: "OP11-096",
  canonicalId: "OP11-096",
  slug: "ripper",
  name: "Ripper",
  printings: [
    {
      id: "OP11-096",
      artId: "OP11-096",
      setCode: "OP11",
      collectorNumber: "096",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP11-096.jpg",
    },
  ],
  cardType: "character",
  color: ["black"],
  rarity: "UC",
  setId: "OP11",
  cost: 1,
  power: 1000,
  counter: 1000,
  traits: ["Navy East Blue"],
  attribute: "wisdom",
  effect:
    'If you have a black "Navy" type Character other than [Ripper], this Character gains [Blocker].\n(After your opponent declares an attack, you may rest this card to make it the new target of the attack.)',
  i18n: op11Ripper096I18n,
};
