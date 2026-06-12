import type { CharacterCard } from "@tcg/lorcana-types";
import { minnieMouseFunkySpelunkerI18n } from "./183-minnie-mouse-funky-spelunker.i18n";

export const minnieMouseFunkySpelunker: CharacterCard = {
  id: "xPZ",
  canonicalId: "ci_xPZ",
  reprints: ["set3-183"],
  cardType: "character",
  name: "Minnie Mouse",
  version: "Funky Spelunker",
  inkType: ["steel"],
  set: "003",
  cardNumber: 183,
  rarity: "common",
  cost: 1,
  strength: 0,
  willpower: 3,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_e5e54863fdb8474db4d0515a2a562ced",
    tcgPlayer: 531824,
  },
  text: [
    {
      title: "JOURNEY",
      description: "While this character is at a location, she gets +2 {S}.",
    },
  ],
  classifications: ["Dreamborn", "Hero"],
  abilities: [
    {
      condition: {
        type: "at-location",
      },
      effect: {
        modifier: 2,
        stat: "strength",
        target: "SELF",
        type: "modify-stat",
      },
      id: "11y-1",
      name: "JOURNEY",
      text: "JOURNEY While this character is at a location, she gets +2 {S}.",
      type: "static",
    },
  ],
  i18n: minnieMouseFunkySpelunkerI18n,
};
