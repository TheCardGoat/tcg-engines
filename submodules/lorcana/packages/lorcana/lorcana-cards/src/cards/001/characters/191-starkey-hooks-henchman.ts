import type { CharacterCard } from "@tcg/lorcana-types";
import { starkeyHooksHenchmanI18n } from "./191-starkey-hooks-henchman.i18n";

export const starkeyHooksHenchman: CharacterCard = {
  id: "lSG",
  canonicalId: "ci_lSG",
  reprints: ["set1-191"],
  cardType: "character",
  name: "Starkey",
  version: "Hook’s Henchman",
  inkType: ["steel"],
  franchise: "Peter Pan",
  set: "001",
  cardNumber: 191,
  rarity: "uncommon",
  cost: 5,
  strength: 5,
  willpower: 4,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_fdbf31b467214b229b4e4f149c487a47",
    tcgPlayer: 508947,
  },
  text: [
    {
      title: "AYE AYE, CAPTAIN",
      description: "While you have a Captain character in play, this character gets +1.",
    },
  ],
  classifications: ["Storyborn", "Ally", "Pirate"],
  abilities: [
    {
      condition: {
        type: "has-character-count",
        controller: "you",
        comparison: "or-more",
        count: 1,
        classification: "Captain",
      },
      effect: {
        modifier: 1,
        stat: "lore",
        target: "SELF",
        type: "modify-stat",
      },
      id: "187-1",
      name: "AYE AYE, CAPTAIN",
      text: "AYE AYE, CAPTAIN While you have a Captain character in play, this character gets +1 {L}.",
      type: "static",
    },
  ],
  i18n: starkeyHooksHenchmanI18n,
};
