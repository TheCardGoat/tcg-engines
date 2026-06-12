import type { CharacterCard } from "@tcg/lorcana-types";
import { gizmoduckDuckburgDefenderI18n } from "./193-gizmoduck-duckburg-defender.i18n";
import { resist } from "../../../helpers/abilities/resist";

export const gizmoduckDuckburgDefender: CharacterCard = {
  id: "9Qc",
  canonicalId: "ci_9Qc",
  reprints: ["set12-193"],
  cardType: "character",
  name: "Gizmoduck",
  version: "Duckburg Defender",
  inkType: ["steel"],
  franchise: "Ducktales",
  set: "012",
  cardNumber: 193,
  rarity: "rare",
  cost: 5,
  strength: 5,
  willpower: 4,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_3828962996af456097d02272026b2b06",
  },
  text: [
    {
      title: "Resist +1",
    },
    {
      title: "FAIL-SAFE",
      description:
        "{} While you have no cards in your hand, opponents can't play actions with cost 4 or more.",
    },
  ],
  classifications: ["Dreamborn", "Super", "Hero", "Inventor"],
  abilities: [
    resist(1),
    {
      id: "9Qc-2",
      name: "FAIL-SAFE",
      type: "static",
      text: "FAIL-SAFE While you have no cards in your hand, opponents can't play actions with cost 4 or more.",
      condition: {
        type: "resource-count",
        what: "cards-in-hand",
        controller: "you",
        comparison: "equal",
        value: 0,
      },
      effect: {
        type: "restriction",
        restriction: "cant-play-actions",
        target: "OPPONENTS",
        minCost: 4,
      },
    },
  ],
  i18n: gizmoduckDuckburgDefenderI18n,
};
