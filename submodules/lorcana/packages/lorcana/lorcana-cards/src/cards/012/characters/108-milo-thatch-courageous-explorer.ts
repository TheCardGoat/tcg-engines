import type { CharacterCard } from "@tcg/lorcana-types";
import { miloThatchCourageousExplorerI18n } from "./108-milo-thatch-courageous-explorer.i18n";

export const miloThatchCourageousExplorer: CharacterCard = {
  id: "tm6",
  canonicalId: "ci_tm6",
  reprints: ["set12-108"],
  cardType: "character",
  name: "Milo Thatch",
  version: "Courageous Explorer",
  inkType: ["ruby"],
  franchise: "Atlantis",
  set: "012",
  cardNumber: 108,
  rarity: "common",
  cost: 3,
  strength: 4,
  willpower: 3,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_81621f1cf94c4b109b89dfdba4289025",
  },
  text: [
    {
      title: "FASCINATING DISCOVERY",
      description:
        "During your turn, if 2 or more cards were put into your discard this turn, this character gets +1 {L}.",
    },
  ],
  abilities: [
    {
      id: "tm6-1",
      name: "FASCINATING DISCOVERY",
      type: "static",
      condition: {
        type: "and",
        conditions: [
          { type: "your-turn" },
          {
            type: "turn-metric",
            metric: "discard-cards-entered",
            ownerScope: "you",
            comparison: { operator: "gte", value: 2 },
          },
        ],
      },
      effect: { type: "modify-stat", stat: "lore", modifier: 1, target: "SELF" },
    },
  ],
  classifications: ["Dreamborn", "Hero"],
  i18n: miloThatchCourageousExplorerI18n,
};
