import type { CharacterCard } from "@tcg/lorcana-types";
import { mickeyMouseBraveLittlePrinceIconicI18n } from "./242-mickey-mouse-brave-little-prince-iconic.i18n";

import { shift } from "../../../helpers/abilities/shift";
import { evasive } from "../../../helpers/abilities/evasive";

export const mickeyMouseBraveLittlePrinceIconic: CharacterCard = {
  id: "N3q",
  canonicalId: "ci_Ka8",
  slug: "lorcana-ci_Ka8",
  printings: [
    {
      id: "set9-242-iconic",
      artId: "ci_Ka8-iconic",
      setCode: "set9",
      collectorNumber: "242",
      rarity: "iconic",
      imageUrl: "",
    },
  ],
  reprints: ["set9-111"],
  cardType: "character",
  name: "Mickey Mouse",
  version: "Brave Little Prince",
  inkType: ["ruby"],
  set: "009",
  cardNumber: 242,
  rarity: "common",
  specialRarity: "iconic",
  cost: 3,
  strength: 2,
  willpower: 2,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_4d10d4cd91454ff389318fd9a19a879f",
    tcgPlayer: "647663",
  },
  text: [
    {
      title: "Shift 5 {I}",
    },
    {
      title: "Evasive",
    },
    {
      title: "CROWNING ACHIEVEMENT",
      description: "While this character has a card under him, he gets +3 {S}, +3 {W}, and +3 {L}.",
    },
  ],
  classifications: ["Floodborn", "Hero", "Prince"],
  abilities: [
    shift(5),
    evasive,
    {
      condition: {
        type: "has-card-under",
      },
      effect: {
        modifier: 3,
        stat: "strength",
        target: "SELF",
        type: "modify-stat",
      },
      id: "cbw-3",
      name: "CROWNING ACHIEVEMENT",
      text: "CROWNING ACHIEVEMENT While this character has a card under him, he gets +3 {S}, +3 {W}, and +3 {L}.",
      type: "static",
    },
    {
      condition: {
        type: "has-card-under",
      },
      effect: {
        modifier: 3,
        stat: "willpower",
        target: "SELF",
        type: "modify-stat",
      },
      id: "cbw-4",
      name: "CROWNING ACHIEVEMENT",
      text: "CROWNING ACHIEVEMENT While this character has a card under him, he gets +3 {S}, +3 {W}, and +3 {L}.",
      type: "static",
    },
    {
      condition: {
        type: "has-card-under",
      },
      effect: {
        modifier: 3,
        stat: "lore",
        target: "SELF",
        type: "modify-stat",
      },
      id: "cbw-5",
      name: "CROWNING ACHIEVEMENT",
      text: "CROWNING ACHIEVEMENT While this character has a card under him, he gets +3 {S}, +3 {W}, and +3 {L}.",
      type: "static",
    },
  ],
  i18n: mickeyMouseBraveLittlePrinceIconicI18n,
};
