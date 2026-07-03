import type { CharacterCard } from "@tcg/lorcana-types";
import { judyHoppsSnowballPatrolEpicI18n } from "./221-judy-hopps-snowball-patrol-epic.i18n";

import { underdog } from "../../../helpers/abilities/underdog";
import { resist } from "../../../helpers/abilities/resist";

export const judyHoppsSnowballPatrolEpic: CharacterCard = {
  id: "DUu",
  canonicalId: "ci_7Tl",
  slug: "lorcana-ci_7Tl",
  printings: [
    {
      id: "set11-221-epic",
      artId: "ci_7Tl-epic",
      setCode: "set11",
      collectorNumber: "221",
      rarity: "epic",
      imageUrl: "",
    },
  ],
  reprints: ["set11-194"],
  cardType: "character",
  name: "Judy Hopps",
  version: "Snowball Patrol",
  inkType: ["steel"],
  franchise: "Zootropolis",
  set: "011",
  cardNumber: 221,
  rarity: "common",
  specialRarity: "epic",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_b7a2a60eb9d34fd986cf0bd44e2a1f1a",
    tcgPlayer: "677156",
  },
  text: [
    {
      title: "UNDERDOG",
      description:
        "If this is your first turn and you're not the first player, you pay 1 {I} less to play this character.",
    },
    {
      title: "Resist +1",
    },
  ],
  classifications: ["Dreamborn", "Hero", "Detective"],
  abilities: [underdog, resist(1)],
  i18n: judyHoppsSnowballPatrolEpicI18n,
};
