import type { CharacterCard } from "@tcg/lorcana-types";
import { trampDapperRascalI18n } from "./022-tramp-dapper-rascal.i18n";
import { shift } from "../../../helpers/abilities/shift";

export const trampDapperRascal: CharacterCard = {
  id: "M9y",
  canonicalId: "ci_M9y",
  reprints: ["set8-022"],
  cardType: "character",
  name: "Tramp",
  version: "Dapper Rascal",
  inkType: ["amber", "emerald"],
  franchise: "Lady and the Tramp",
  set: "008",
  cardNumber: 22,
  rarity: "common",
  cost: 6,
  strength: 2,
  willpower: 8,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_85f71d1d81a54038b066e3efe226a8f9",
    tcgPlayer: 631366,
  },
  text: [
    {
      title: "Shift 4",
    },
    {
      title: "PLAY IT COOL",
      description:
        "During an opponent's turn, whenever one of your characters is banished, you may draw a card.",
    },
  ],
  classifications: ["Floodborn", "Hero"],
  abilities: [
    shift(4),
    {
      id: "1x4-2",
      name: "PLAY IT COOL",
      trigger: {
        event: "banish",
        on: "YOUR_CHARACTERS",
        timing: "whenever",
        restrictions: [
          {
            type: "during-turn",
            whose: "opponent",
          },
        ],
      },
      effect: {
        chooser: "CONTROLLER",
        effect: {
          amount: 1,
          target: "CONTROLLER",
          type: "draw",
        },
        type: "optional",
      },
      type: "triggered",
      text: "PLAY IT COOL During an opponent’s turn, whenever one of your characters is banished, you may draw a card.",
    },
  ],
  i18n: trampDapperRascalI18n,
};
