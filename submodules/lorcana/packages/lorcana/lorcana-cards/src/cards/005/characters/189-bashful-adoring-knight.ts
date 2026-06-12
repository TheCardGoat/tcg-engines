import type { CharacterCard } from "@tcg/lorcana-types";
import { bashfulAdoringKnightI18n } from "./189-bashful-adoring-knight.i18n";

export const bashfulAdoringKnight: CharacterCard = {
  id: "bvY",
  canonicalId: "ci_bvY",
  reprints: ["set5-189"],
  cardType: "character",
  name: "Bashful",
  version: "Adoring Knight",
  inkType: ["steel"],
  franchise: "Snow White",
  set: "005",
  cardNumber: 189,
  rarity: "uncommon",
  cost: 4,
  strength: 3,
  willpower: 4,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_f2e3f60f19eb409eaccc1a8dc10f8ebd",
    tcgPlayer: 559662,
  },
  text: [
    {
      title: "IMPRESS THE PRINCESS",
      description:
        "While you have a character named Snow White in play, this character gains Bodyguard. (An opposing character who challenges one of your characters must choose one with Bodyguard if able.)",
    },
  ],
  classifications: ["Dreamborn", "Ally", "Knight", "Seven Dwarfs"],
  abilities: [
    {
      condition: {
        type: "has-named-character",
        name: "Snow White",
        controller: "you",
      },
      effect: {
        keyword: "Bodyguard",
        target: "SELF",
        type: "gain-keyword",
      },
      id: "gwv-1",
      name: "IMPRESS THE PRINCESS",
      text: "IMPRESS THE PRINCESS While you have a character named Snow White in play, this character gains Bodyguard.",
      type: "static",
    },
  ],
  i18n: bashfulAdoringKnightI18n,
};
