import type { CharacterCard } from "@tcg/lorcana-types";
import { kuzcoTemperamentalEmperorC1ChallengeI18n } from "./c1-008-kuzco-temperamental-emperor-challenge.i18n";

import { ward } from "../../../helpers/abilities/ward";

export const kuzcoTemperamentalEmperorC1Challenge: CharacterCard = {
  id: "DLw",
  canonicalId: "ci_2TN",
  slug: "lorcana-ci_2TN",
  printings: [
    {
      id: "set1-c1-008-challenge",
      artId: "ci_2TN-challenge",
      setCode: "set1",
      collectorNumber: "8",
      rarity: "challenge",
      imageUrl: "",
    },
  ],
  reprints: ["set1-084", "set9-069"],
  cardType: "character",
  name: "Kuzco",
  version: "Temperamental Emperor",
  inkType: ["emerald"],
  franchise: "Emperors New Groove",
  set: "001",
  cardNumber: 8,
  rarity: "special",
  specialRarity: "challenge",
  cost: 5,
  strength: 2,
  willpower: 4,
  lore: 3,
  inkable: false,
  externalIds: {
    lorcast: "crd_758f6165053247138a43133356718b77",
    tcgPlayer: "650011",
  },
  text: [
    {
      title: "Ward",
    },
    {
      title: "NO TOUCHY!",
      description:
        "When this character is challenged and banished, you may banish the challenging character.",
    },
  ],
  classifications: ["Storyborn", "King"],
  abilities: [
    ward,
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          target: {
            ref: "attacker",
          },
          type: "banish",
        },
        type: "optional",
      },
      id: "1og-2",
      name: "NO TOUCHY!",
      sourceZones: ["play", "discard"],
      text: "NO TOUCHY! When this character is challenged and banished, you may banish the challenging character.",
      trigger: {
        event: "challenged-and-banished",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  i18n: kuzcoTemperamentalEmperorC1ChallengeI18n,
};
