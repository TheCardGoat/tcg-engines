import type { CharacterCard } from "@tcg/lorcana-types";
import { tinkerBellTemperamentalFairyI18n } from "./115-tinker-bell-temperamental-fairy.i18n";

export const tinkerBellTemperamentalFairy: CharacterCard = {
  id: "OR6",
  canonicalId: "ci_OR6",
  reprints: ["set10-115"],
  cardType: "character",
  name: "Tinker Bell",
  version: "Temperamental Fairy",
  inkType: ["ruby"],
  franchise: "Peter Pan",
  set: "010",
  cardNumber: 115,
  rarity: "uncommon",
  cost: 5,
  strength: 5,
  willpower: 3,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_0a3d4d70ca5f45bfa3642a425a4943f9",
    tcgPlayer: 659191,
  },
  text: [
    {
      title: "Shift 3 {I}",
    },
    {
      title: "HARMLESS DIVERSION",
      description:
        "When you play this character, exert chosen opposing character with 2 {S} or less.",
    },
  ],
  classifications: ["Floodborn", "Ally", "Fairy"],
  abilities: [
    {
      cost: {
        ink: 3,
      },
      id: "yus-1",
      keyword: "Shift",
      text: "Shift 3 {I}",
      type: "keyword",
    },
    {
      effect: {
        target: {
          cardTypes: ["character"],
          count: 1,
          owner: "opponent",
          selector: "chosen",
          zones: ["play"],
          filter: [
            {
              type: "strength-comparison",
              comparison: "less-or-equal",
              value: 2,
            },
          ],
        },
        type: "exert",
      },
      id: "yus-2",
      name: "HARMLESS DIVERSION",
      text: "HARMLESS DIVERSION When you play this character, exert chosen opposing character with 2 {S} or less.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  i18n: tinkerBellTemperamentalFairyI18n,
};
