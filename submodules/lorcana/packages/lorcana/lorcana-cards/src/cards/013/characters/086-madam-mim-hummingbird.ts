import type { CharacterCard } from "@tcg/lorcana-types";
import { madamMimHummingbirdI18n } from "./086-madam-mim-hummingbird.i18n";

import { evasive } from "../../../helpers/abilities/evasive";

export const madamMimHummingbird: CharacterCard = {
  id: "j84",
  canonicalId: "ci_j84",
  slug: "lorcana-ci_j84",
  printings: [
    {
      id: "set13-086",
      artId: "set13-086",
      setCode: "set13",
      collectorNumber: "86",
      rarity: "uncommon",
      imageUrl: "",
    },
  ],
  reprints: ["set13-086"],
  cardType: "character",
  name: "Madam Mim",
  version: "Hummingbird",
  inkType: ["emerald"],
  franchise: "Sword in the Stone",
  set: "013",
  cardNumber: 86,
  rarity: "uncommon",
  cost: 2,
  strength: 1,
  willpower: 1,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_2cc6572c2d0b46c68b10de5d90170819",
    tcgPlayer: "704600",
  },
  text: [
    {
      title: "Evasive",
    },
    {
      title: "JUST HOW",
      description: "I LIKE IT All cards in your hand count as having {IW}.",
    },
  ],
  classifications: ["Dreamborn", "Villain", "Sorcerer"],
  abilities: [
    evasive,
    {
      type: "static",
      name: "JUST HOW I LIKE IT",
      text: "JUST HOW I LIKE IT All cards in your hand count as having {I}.",
      effect: {
        type: "grant-hand-inkability",
      },
    },
  ],
  i18n: madamMimHummingbirdI18n,
};
