import type { CharacterCard } from "@tcg/lorcana-types";
import { rufusOrphanageCatI18n } from "./153-rufus-orphanage-cat.i18n";

export const rufusOrphanageCat: CharacterCard = {
  id: "Lpq",
  canonicalId: "ci_Lpq",
  reprints: ["set3-153"],
  cardType: "character",
  name: "Rufus",
  version: "Orphanage Cat",
  inkType: ["sapphire"],
  franchise: "Rescuers",
  set: "003",
  cardNumber: 153,
  rarity: "common",
  cost: 5,
  strength: 4,
  willpower: 5,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_c914737245874c918af51cac073d6d36",
    tcgPlayer: 539100,
  },
  text: [
    {
      title: "TOO OLD TO BE CHASING MICE",
      description:
        "When this character is banished, you may put this card into your inkwell facedown and exerted.",
    },
  ],
  classifications: ["Dreamborn", "Ally"],
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          exerted: true,
          facedown: true,
          source: "this-card",
          target: "CONTROLLER",
          type: "put-into-inkwell",
        },
        type: "optional",
      },
      id: "1us-1",
      name: "TOO OLD TO BE CHASING MICE",
      text: "TOO OLD TO BE CHASING MICE When this character is banished, you may put this card into your inkwell facedown and exerted.",
      trigger: {
        event: "banish",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  i18n: rufusOrphanageCatI18n,
};
