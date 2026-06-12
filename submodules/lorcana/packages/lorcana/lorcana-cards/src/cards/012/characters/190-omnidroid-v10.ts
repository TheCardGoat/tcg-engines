import type { CharacterCard } from "@tcg/lorcana-types";
import { omnidroidV10I18n } from "./190-omnidroid-v10.i18n";
import { shift } from "../../../helpers/abilities/shift";

export const omnidroidV10: CharacterCard = {
  id: "TLT",
  canonicalId: "ci_TLT",
  reprints: ["set12-190"],
  cardType: "character",
  name: "Omnidroid",
  version: "V.10",
  inkType: ["steel"],
  franchise: "Incredibles",
  set: "012",
  cardNumber: 190,
  rarity: "rare",
  cost: 6,
  strength: 6,
  willpower: 6,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_c894240fefa847e6aec7d10546131a7a",
  },
  text: [
    {
      title: "Shift 4 {I}",
    },
    {
      title: "ELECTRO-ARMOR",
      description: "While there's a card under this character, it gains Resist +2.",
    },
  ],
  classifications: ["Storyborn", "Robot"],
  abilities: [
    shift(4),
    {
      id: "TLT-2",
      name: "ELECTRO-ARMOR",
      type: "static",
      condition: {
        type: "has-card-under",
      },
      effect: {
        type: "gain-keyword",
        keyword: "Resist",
        value: 2,
        target: "SELF",
      },
      text: "ELECTRO-ARMOR While there's a card under this character, it gains Resist +2.",
    },
  ],
  i18n: omnidroidV10I18n,
};
