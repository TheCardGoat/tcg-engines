import type { CharacterCard } from "@tcg/lorcana-types";
import { kuzcoTemperamentalEmperorI18n } from "./084-kuzco-temperamental-emperor.i18n";
import { ward } from "../../../helpers/abilities/ward";

export const kuzcoTemperamentalEmperor: CharacterCard = {
  id: "H6u",
  canonicalId: "ci_Vm2",
  reprints: ["set1-084", "set9-069"],
  cardType: "character",
  name: "Kuzco",
  version: "Temperamental Emperor",
  inkType: ["emerald"],
  franchise: "Emperors New Groove",
  set: "001",
  cardNumber: 84,
  rarity: "rare",
  cost: 5,
  strength: 2,
  willpower: 4,
  lore: 3,
  inkable: false,
  externalIds: {
    lorcast: "crd_758f6165053247138a43133356718b77",
    tcgPlayer: 650011,
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
  i18n: kuzcoTemperamentalEmperorI18n,
};
