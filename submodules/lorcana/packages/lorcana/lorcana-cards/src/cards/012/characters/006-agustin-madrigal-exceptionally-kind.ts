import type { CharacterCard } from "@tcg/lorcana-types";
import { agustinMadrigalExceptionallyKindI18n } from "./006-agustin-madrigal-exceptionally-kind.i18n";

import { support } from "../../../helpers/abilities/support";

export const agustinMadrigalExceptionallyKind: CharacterCard = {
  id: "xWz",
  canonicalId: "ci_xWz",
  slug: "lorcana-ci_xWz",
  printings: [
    {
      id: "set12-006",
      artId: "set12-006",
      setCode: "set12",
      collectorNumber: "6",
      rarity: "common",
      imageUrl: "",
    },
  ],
  reprints: ["set12-006"],
  cardType: "character",
  name: "Agustin Madrigal",
  version: "Exceptionally Kind",
  inkType: ["amber"],
  franchise: "Encanto",
  set: "012",
  cardNumber: 6,
  rarity: "common",
  cost: 4,
  strength: 3,
  willpower: 6,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_06b56190f0d84ae58f902fdf86cea771",
    tcgPlayer: "690707",
  },
  text: "Support",
  classifications: ["Dreamborn", "Mentor", "Madrigal"],
  abilities: [support],
  i18n: agustinMadrigalExceptionallyKindI18n,
};
