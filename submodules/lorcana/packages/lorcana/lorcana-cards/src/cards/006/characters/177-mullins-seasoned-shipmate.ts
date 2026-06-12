import type { CharacterCard } from "@tcg/lorcana-types";
import { mullinsSeasonedShipmateI18n } from "./177-mullins-seasoned-shipmate.i18n";

export const mullinsSeasonedShipmate: CharacterCard = {
  id: "jPG",
  canonicalId: "ci_jPG",
  reprints: ["set6-177"],
  cardType: "character",
  name: "Mullins",
  version: "Seasoned Shipmate",
  inkType: ["steel"],
  franchise: "Peter Pan",
  set: "006",
  cardNumber: 177,
  rarity: "common",
  cost: 5,
  strength: 6,
  willpower: 4,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_426eee4c74d74ab08c77aea2b5640760",
    tcgPlayer: 592011,
  },
  text: [
    {
      title: "FALL IN LINE",
      description:
        "While you have a character named Mr. Smee in play, this character gains Resist +1.",
    },
  ],
  classifications: ["Storyborn", "Ally", "Pirate"],
  abilities: [
    {
      id: "meu-1",
      type: "static",
      name: "FALL IN LINE",
      text: "FALL IN LINE While you have a character named Mr. Smee in play, this character gains Resist +1.",
      condition: {
        type: "has-named-character",
        name: "Mr. Smee",
        controller: "you",
      },
      effect: {
        keyword: "Resist",
        target: "SELF",
        type: "gain-keyword",
        value: 1,
      },
    },
  ],
  i18n: mullinsSeasonedShipmateI18n,
};
