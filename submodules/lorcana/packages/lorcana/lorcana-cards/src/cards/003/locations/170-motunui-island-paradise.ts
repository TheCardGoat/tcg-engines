import type { LocationCard } from "@tcg/lorcana-types";
import { motunuiIslandParadiseI18n } from "./170-motunui-island-paradise.i18n";

export const motunuiIslandParadise: LocationCard = {
  id: "32z",
  canonicalId: "ci_foY",
  reprints: ["set3-170", "set9-170"],
  cardType: "location",
  name: "Motunui",
  version: "Island Paradise",
  inkType: ["sapphire"],
  franchise: "Moana",
  set: "003",
  cardNumber: 170,
  rarity: "uncommon",
  cost: 2,
  willpower: 5,
  moveCost: 1,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_fc47f435832f4356ab419cf268febdb2",
    tcgPlayer: 650104,
  },
  text: [
    {
      title: "REINCARNATION",
      description:
        "Whenever a character is banished while here, you may put that card into your inkwell facedown and exerted.",
    },
  ],
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        type: "optional",
        effect: {
          exerted: true,
          facedown: true,
          source: {
            ref: "trigger-source",
          },
          target: "CONTROLLER",
          type: "put-into-inkwell",
        },
      },
      id: "32z-1",
      name: "REINCARNATION",
      text: "REINCARNATION Whenever a character is banished while here, you may put that card into your inkwell facedown and exerted.",
      trigger: {
        event: "banish",
        on: "CHARACTERS_HERE",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  i18n: motunuiIslandParadiseI18n,
};
