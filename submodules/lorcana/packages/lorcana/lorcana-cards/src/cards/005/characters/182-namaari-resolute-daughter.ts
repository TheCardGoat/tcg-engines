import type { CharacterCard } from "@tcg/lorcana-types";
import { namaariResoluteDaughterI18n } from "./182-namaari-resolute-daughter.i18n";
import { resist } from "../../../helpers/abilities/resist";

export const namaariResoluteDaughter: CharacterCard = {
  id: "2TR",
  canonicalId: "ci_fJp",
  reprints: ["set5-182"],
  cardType: "character",
  name: "Namaari",
  version: "Resolute Daughter",
  inkType: ["steel"],
  franchise: "Raya and the Last Dragon",
  set: "005",
  cardNumber: 182,
  rarity: "rare",
  cost: 9,
  strength: 5,
  willpower: 5,
  lore: 3,
  inkable: false,
  externalIds: {
    lorcast: "crd_7bc86960d8004c408340e121f634035b",
    tcgPlayer: 561972,
  },
  text: [
    {
      title:
        "I DON'T HAVE ANY OTHER CHOICE For each opposing character banished in a challenge this turn, you pay 2 {I} less to play this character.",
    },
    {
      title: "Resist +3",
    },
  ],
  classifications: ["Storyborn", "Villain", "Princess"],
  abilities: [
    {
      id: "1t7-1",
      name: "I DON'T HAVE ANY OTHER CHOICE",
      effect: {
        type: "cost-reduction",
        amount: {
          type: "turn-metric",
          metric: "banished-in-challenge-count",
          owner: "opponent",
          multiplier: 2,
        },
      },
      sourceZones: ["hand"],
      type: "static",
      text: "I DON'T HAVE ANY OTHER CHOICE For each opposing character banished in a challenge this turn, you pay 2 {I} less to play this character.",
    },
    resist(3),
  ],
  i18n: namaariResoluteDaughterI18n,
};
